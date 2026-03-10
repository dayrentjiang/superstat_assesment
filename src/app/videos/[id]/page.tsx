import { getVideoById } from "@/actions/videos";
import { getEventsByVideoId } from "@/actions/events";
import { getPlayers } from "@/actions/players";
import { VideoReview } from "@/components/video-review";
import { notFound } from "next/navigation";

export default async function VideoReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [video, events, players] = await Promise.all([
    getVideoById(id),
    getEventsByVideoId(id),
    getPlayers(),
  ]);

  if (!video) {
    notFound();
  }

  return <VideoReview video={video} initialEvents={events} players={players} />;
}
