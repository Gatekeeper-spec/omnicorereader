import { createFileRoute } from "@tanstack/react-router";
import { ReaderView } from "@/components/reader-view";

export const Route = createFileRoute("/app/reader/$bookId")({
  component: ReaderPage,
});

function ReaderPage() {
  const { bookId } = Route.useParams();
  return <ReaderView bookId={bookId} />;
}
