"use client";

import {
  Plus,
  LayoutGrid,
  Search,
  Settings,
  User,
  History,
  KeyRound,
  Folder,
  LogOut,
  Check,
  Pencil,
  Loader2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const [flows, setFlows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState<string | null>(null);
  const [cardLoadingId, setCardLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
      const { data, error } = await supabase
        .from("flows")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (!error && data) setFlows(data);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleCreateFlow = async () => {
    setCreateLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setCreateLoading(false);
      return;
    }

    // Check if this is the user's first flow
    const isFirstFlow = flows.length === 0;

    const { data, error } = await supabase
      .from("flows")
      .insert({
        user_id: user.id,
        name: "Untitled Flow",
        description: "",
        graph_json: { nodes: [], edges: [] },
      })
      .select("id")
      .single();
    setCreateLoading(false);

    if (!error && data?.id) {
      // If it's the first flow, store that we should show the tutorial
      if (isFirstFlow) {
        localStorage.setItem("showBuilderTutorial", "true");
      }
      router.push(`/builder/${data.id}`);
    }
  };

  const handleRename = async (flowId: string, newName: string) => {
    setRenameLoading(flowId);
    const supabase = createClient();
    await supabase.from("flows").update({ name: newName }).eq("id", flowId);
    setFlows((flows) =>
      flows.map((f) => (f.id === flowId ? { ...f, name: newName } : f))
    );
    setEditingId(null);
    setRenameLoading(null);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDelete = async (e: React.MouseEvent, flowId: string) => {
    e.stopPropagation();
    if (
      !confirm(
        "Are you sure you want to delete this flow? This action cannot be undone."
      )
    )
      return;

    setDeleteLoading(flowId);
    const supabase = createClient();
    const { error } = await supabase.from("flows").delete().eq("id", flowId);
    if (!error) {
      setFlows((flows) => flows.filter((f) => f.id !== flowId));
    }
    setDeleteLoading(null);
  };

  if (isAuthenticated === null) return null;
  if (isAuthenticated === false) return null;

  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col px-10 py-8 gap-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
              Dashboard
            </h1>
            <div className="text-muted-foreground text-sm">All Flows</div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleCreateFlow} disabled={createLoading}>
              {createLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Plus size={18} />
              )}
              {createLoading ? "Creating..." : "Create Flow"}
            </Button>
          </div>
        </header>
        <div className="flex items-center gap-3 mb-4">
          <Button variant="secondary" size="icon" onClick={() => {}}>
            <LayoutGrid size={18} />
          </Button>
          <Input
            type="text"
            placeholder="Search flows"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : flows.filter(
              (flow) =>
                flow.name.toLowerCase().includes(search.toLowerCase()) ||
                flow.description?.toLowerCase().includes(search.toLowerCase())
            ).length > 0 ? (
            flows
              .filter(
                (flow) =>
                  flow.name.toLowerCase().includes(search.toLowerCase()) ||
                  flow.description?.toLowerCase().includes(search.toLowerCase())
              )
              .map((flow) => (
                <div
                  key={flow.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setCardLoadingId(flow.id);
                    router.push(`/builder/${flow.id}`);
                  }}
                >
                  <Card
                    className="border-zinc-800/60 p-6 flex flex-col gap-2 hover:shadow-xl transition group relative"
                    shadow="lg"
                    radius="lg"
                  >
                    {cardLoadingId === flow.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10 rounded-2xl">
                        <Loader2 className="animate-spin" size={32} />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <LayoutGrid size={20} className="text-primary" />
                        {editingId === flow.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleRename(flow.id, editValue);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => handleRename(flow.id, editValue)}
                              variant="underlined"
                              className="text-lg font-semibold w-32"
                            />
                            <Button
                              type="submit"
                              size="icon"
                              variant="ghost"
                              className="ml-1 h-7 w-7"
                              disabled={renameLoading === flow.id}
                            >
                              {renameLoading === flow.id ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                <Check size={16} />
                              )}
                            </Button>
                          </form>
                        ) : (
                          <span
                            className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition cursor-pointer flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(flow.id);
                              setEditValue(flow.name);
                            }}
                          >
                            {flow.name}
                            <Pencil
                              size={14}
                              className="ml-1 opacity-60 group-hover:opacity-100"
                            />
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={(e) => handleDelete(e, flow.id)}
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600"
                        disabled={deleteLoading === flow.id}
                      >
                        {deleteLoading === flow.id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </Button>
                    </div>
                    <div className="text-muted-foreground text-sm mb-1">
                      {flow.description}
                    </div>
                    <div className="flex items-center gap-2 mt-auto text-xs text-muted-foreground">
                      <span>
                        Edited{" "}
                        {flow.updated_at
                          ? new Date(flow.updated_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </Card>
                </div>
              ))
          ) : (
            <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-primary/60 to-gray-700/60 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Getting started with AgentFlow
              </h2>
              <Button onClick={handleCreateFlow} size="lg" className="mt-4">
                Start learning
              </Button>
            </div>
          )}
        </section>
      </main>
      <div className="fixed bottom-0 left-0 m-6 flex items-center gap-2 z-50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 border border-border">
          <User size={18} className="text-muted-foreground" />
          <span className="text-foreground font-medium">User</span>
          <LogOut
            size={16}
            className="ml-auto text-muted-foreground cursor-pointer hover:text-primary transition"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}
