'use client';

interface NotePreviewErrorProps {
  error: Error;
}

export default function NotePreviewError({ error }: NotePreviewErrorProps) {
  return <p>Could not fetch note details. {error.message}</p>;
}
