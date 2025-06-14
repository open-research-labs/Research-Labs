"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface Publication {
  id: string;
  title: string;
  abstract: string;
  journal: string;
  doi: string;
  status: string;
  visibility: string;
  submitter_id: string;
  conference_id: string | null;
  submitted_at: string;
}

interface Conference {
  id: string;
  name: string;
}

const VALID_STATUSES = ["DRAFT", "APPROVED", "WAITING", "DELETED"];
const VALID_VISIBILITIES = ["PUBLIC", "PRIVATE"];

export default function EditPublicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const publicationId = params.id;

  const [publication, setPublication] = useState<Publication | null>(null);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [journal, setJournal] = useState("");
  const [doi, setDoi] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [conferenceId, setConferenceId] = useState<string | "">("");

  // Fetch publication
  useEffect(() => {
    async function fetchData() {
      try {
        const [pubRes, confRes] = await Promise.all([
          fetch(`http://127.0.0.1:6188/rust/api/publications/${publicationId}`),
          fetch(`http://127.0.0.1:6188/rust/api/conferences`),
        ]);

        if (!pubRes.ok || !confRes.ok) throw new Error("Failed to fetch data");

        const publication: Publication = await pubRes.json();
        const conferences: Conference[] = await confRes.json();

        setPublication(publication);
        setConferences(conferences);

        setTitle(publication.title);
        setAbstract(publication.abstract ?? "");
        setJournal(publication.journal);
        setDoi(publication.doi);
        setStatus(publication.status);
        setVisibility(publication.visibility);
        setConferenceId(publication.conference_id ?? "");
      } catch (error) {
        toast.error("Failed to load publication or conferences");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [publicationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (!journal.trim()) return toast.error("Journal is required");
    if (!VALID_STATUSES.includes(status)) return toast.error("Invalid status");
    if (!VALID_VISIBILITIES.includes(visibility)) return toast.error("Invalid visibility");

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:6188/rust/api/publications/${publicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract,
          journal,
          doi,
          status,
          visibility,
          conference_id: conferenceId || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update publication");

      toast.success("Publication updated successfully");
      router.push(`/publications/${publicationId}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update publication");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!publication) return <p className="text-center py-10 text-red-500">Publication not found</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <Link href={`/publications/${publicationId}`} className="text-blue-600 hover:underline">
        ← Back to publication details
      </Link>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Edit Publication</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">
                Abstract
              </label>
              <textarea
                id="abstract"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="journal" className="block text-sm font-medium text-gray-700">
                Journal <span className="text-red-500">*</span>
              </label>
              <textarea
                id="journal"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                rows={3}
                required
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="doi" className="block text-sm font-medium text-gray-700">
                DOI
              </label>
              <input
                id="doi"
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border px-3 py-2"
              >
                {VALID_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                Visibility <span className="text-red-500">*</span>
              </label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border px-3 py-2"
              >
                {VALID_VISIBILITIES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="conference" className="block text-sm font-medium text-gray-700">
                Conference
              </label>
              <select
                id="conference"
                value={conferenceId}
                onChange={(e) => setConferenceId(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              >
                <option value="">None</option>
                {conferences.map((conf) => (
                  <option key={conf.id} value={conf.id}>
                    {conf.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href={`/publications/${publicationId}`}
                className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </Link>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
