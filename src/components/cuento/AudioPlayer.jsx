import { useState, useRef, useEffect } from 'react'

export default function AudioPlayer({ src, title }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoaded = () => { setDuration(audio.duration); setLoading(false) }
    const onTime = () => setCurrentTime(audio.currentTime)
    const onEnded = () => setPlaying(false)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
      setPlaying(true)
    }
  }

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const newTime = ratio * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full max-w-md mx-auto">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        {/* Title */}
        {title && (
          <p className="text-crema/70 text-xs text-center mb-4 font-medium tracking-wide uppercase">
            {title}
          </p>
        )}

        {/* Play/pause */}
        <div className="flex justify-center mb-5">
          <button
            onClick={togglePlay}
            disabled={loading}
            className="w-16 h-16 rounded-full bg-terracota hover:bg-ambar disabled:opacity-40 transition-colors flex items-center justify-center shadow-lg"
            aria-label={playing ? 'Pausar' : 'Reproducir'}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : playing ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div
          className="relative h-2 bg-white/20 rounded-full cursor-pointer mb-2"
          onClick={seek}
        >
          <div
            className="absolute left-0 top-0 h-full bg-terracota rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Time */}
        <div className="flex justify-between text-crema/50 text-xs">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  )
}
