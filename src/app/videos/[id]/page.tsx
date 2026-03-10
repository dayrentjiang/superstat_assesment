import { getVideoById } from "@/actions/videos";
import { getEventsByVideoId } from "@/actions/events";
import { getSummary } from "@/actions/summary";
import { getPlayers } from "@/actions/players";
import { VideoReview } from "@/components/videos/video-review";
import { notFound } from "next/navigation";

export default async function VideoReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [video, events, players, summary] = await Promise.all([
    getVideoById(id),
    getEventsByVideoId(id),
    getPlayers(),
    getSummary(id),
  ]);

  if (!video) {
    notFound();
  }

  return (
    <VideoReview
      video={video}
      initialEvents={events}
      players={players}
      initialSummary={summary?.content ?? null}
    />
  );
}
