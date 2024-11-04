import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Lesson } from '../../types';

export const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { lessonId } = useParams();

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch lesson');
      return response.json();
    },
  });

  const progressMutation = useMutation({
    mutationFn: async (timeSpent: number) => {
      const response = await fetch(`/api/progress/${lessonId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ timeSpent }),
      });
      if (!response.ok) throw new Error('Failed to update progress');
      return response.json();
    },
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.currentTime % 30 === 0) { // Update progress every 30 seconds
        progressMutation.mutate(30);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [lessonId]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  if (isLoading || !lesson) return <div>Loading video...</div>;

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={lesson.videoUrl}
        className="w-full aspect-video"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-4 text-white">
          <button onClick={togglePlay} className="hover:text-blue-400">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          <button onClick={() => skip(-10)} className="hover:text-blue-400">
            <SkipBack className="w-5 h-5" />
          </button>

          <button onClick={() => skip(10)} className="hover:text-blue-400">
            <SkipForward className="w-5 h-5" />
          </button>

          <div className="flex-1 mx-4">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full"
            />
          </div>

          <button onClick={toggleMute} className="hover:text-blue-400">
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>

          <button onClick={toggleFullscreen} className="hover:text-blue-400">
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};