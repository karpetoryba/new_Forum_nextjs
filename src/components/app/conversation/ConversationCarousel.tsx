"use client";

import { useEffect, useRef, useState } from "react";
import ConversationService from "@/services/conversation.service";
import { useQuery } from "@tanstack/react-query";
import ConversationCard from "./ConversationCard";
import { ConversationWithExtend } from "@/types/conversation.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConversationCarouselProps {
  autoScrollInterval?: number; 
}

export default function ConversationCarousel({
  autoScrollInterval = 4000, 
}: ConversationCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", false],
    queryFn: async () => {
      return await ConversationService.fetchConversations(false);
    },
  });

 
  useEffect(() => {
    if (!conversations || conversations.length === 0 || isPaused) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const scroll = () => {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const currentScroll = container.scrollLeft;

    
      if (currentScroll + clientWidth >= scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: clientWidth, behavior: "smooth" });
      }
    };

    const intervalId = setInterval(scroll, autoScrollInterval);

    return () => clearInterval(intervalId);
  }, [conversations, autoScrollInterval, isPaused]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
      setIsPaused(true);
     
      setTimeout(() => setIsPaused(false), 10000);
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
      setIsPaused(true);
      // Resume auto-scroll after 10 seconds of manual control
      setTimeout(() => setIsPaused(false), 10000);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground">Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground">Aucune conversation disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 relative group">
      {/* Left button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",
          "-translate-x-4 md:-translate-x-12"
        )}
        onClick={scrollLeft}
        aria-label="Conversation précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Carousel container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {(conversations as ConversationWithExtend[]).map((conversation) => (
          <div
            key={conversation.id}
            className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 snap-start"
          >
            <ConversationCard conversation={conversation} />
          </div>
        ))}
      </div>

      {/* Right button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",
          "translate-x-4 md:translate-x-12"
        )}
        onClick={scrollRight}
        aria-label="Conversation suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

