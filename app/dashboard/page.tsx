"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, type Note } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { useTheme } from "@/components/theme-provider"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const router = useRouter()

  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/login")
        return
      }

      // Double-check email verification
      if (!session.user.email_confirmed_at) {
        await supabase.auth.signOut()
        router.push("/auth/login?error=Please verify your email before accessing the dashboard")
        return
      }

      setUser(session.user)
      await fetchNotes()
      setLoading(false)
    }

    getUser()
  }, [router])

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error: any) {
      setError("Failed to fetch notes")
      console.error("Error fetching notes:", error)
    }
  }

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError("Title and content are required")
      return
    }

    setCreating(true)
    setError("")

    try {
      const { error } = await supabase.from("notes").insert([
        {
          title: newNote.title.trim(),
          content: newNote.content.trim(),
          user_id: user.id,
        },
      ])

      if (error) throw error

      setNewNote({ title: "", content: "" })
      setIsNoteModalOpen(false)
      setCurrentNote(null)
      await fetchNotes()
      showToast("Note created successfully", "success")
    } catch (error: any) {
      setError("Failed to create note")
      console.error("Error creating note:", error)
    } finally {
      setCreating(false)
    }
  }

  const updateNote = async () => {
    if (!currentNote || !newNote.title.trim() || !newNote.content.trim()) {
      setError("Title and content are required")
      return
    }

    setCreating(true)
    setError("")

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: newNote.title.trim(),
          content: newNote.content.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentNote.id)

      if (error) throw error

      setNewNote({ title: "", content: "" })
      setIsNoteModalOpen(false)
      setCurrentNote(null)
      await fetchNotes()
      showToast("Note updated successfully", "success")
    } catch (error: any) {
      setError("Failed to update note")
      console.error("Error updating note:", error)
    } finally {
      setCreating(false)
    }
  }

  const deleteNote = async (noteId: string) => {
    setDeleting(noteId)
    setError("")

    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteId)

      if (error) throw error

      await fetchNotes()
      setIsDeleteModalOpen(false)
      setNoteToDelete(null)
      showToast("Note deleted successfully", "success")
    } catch (error: any) {
      setError("Failed to delete note")
      console.error("Error deleting note:", error)
    } finally {
      setDeleting(null)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleToggleTheme = () => {
    toggleTheme()
    showToast(`Switched to ${theme === "light" ? "dark" : "light"} theme`, "success")
  }

  const showToast = (message: string, type: "success" | "error" | "warning" = "success") => {
    // Simple toast implementation
    const toast = document.createElement("div")
    toast.className = `toast ${type}`
    toast.innerHTML = `
      <span>${type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}</span>
      <span>${message}</span>
    `

    let container = document.getElementById("toast-container")
    if (!container) {
      container = document.createElement("div")
      container.id = "toast-container"
      container.className = "toast-container"
      document.body.appendChild(container)
    }

    container.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = "toastSlide 0.3s reverse"
      setTimeout(() => {
        if (container && container.contains(toast)) {
          container.removeChild(toast)
        }
      }, 300)
    }, 4000)
  }

  const openNoteModal = (note?: Note) => {
    if (note) {
      setCurrentNote(note)
      setNewNote({ title: note.title, content: note.content })
    } else {
      setCurrentNote(null)
      setNewNote({ title: "", content: "" })
    }
    setIsNoteModalOpen(true)
    setError("")
  }

  const openDeleteModal = (noteId: string) => {
    setNoteToDelete(noteId)
    setIsDeleteModalOpen(true)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h2>My Notes</h2>
            <button className="btn btn--secondary" onClick={handleToggleTheme}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
          <div className="header-right">
            <button className="btn btn--secondary" onClick={() => setIsProfileModalOpen(true)}>
              <span>👤</span>
              Profile
            </button>
            <button className="btn btn--outline" onClick={handleLogout}>
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="notes-grid">
          {notes.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: "64px", marginBottom: "var(--space-16)", display: "block" }}>📝</span>
              <h3>No notes yet</h3>
              <p>Create your first note by clicking the + button</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="note-card fade-in" onClick={() => openNoteModal(note)}>
                <div className="note-card-header">
                  <h3 className="note-title">{note.title}</h3>
                  <div className="note-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openNoteModal(note)
                      }}
                      className="btn btn--secondary"
                      style={{ padding: "var(--space-4)", minWidth: "auto" }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openDeleteModal(note.id)
                      }}
                      className="btn btn--outline"
                      style={{
                        padding: "var(--space-4)",
                        minWidth: "auto",
                        color: "var(--color-error)",
                        borderColor: "var(--color-error)",
                      }}
                      disabled={deleting === note.id}
                      title="Delete"
                    >
                      {deleting === note.id ? "⏳" : "🗑️"}
                    </button>
                  </div>
                </div>
                <p className="note-content">{note.content}</p>
                <div className="note-date">{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fab" onClick={() => openNoteModal()}>
        <span style={{ fontSize: "24px" }}>+</span>
      </button>

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setIsNoteModalOpen(false)}>
          <div
            className="modal-content modal-large"
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--space-24) var(--space-24) var(--space-16)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <h3>{currentNote ? "Edit Note" : "Create Note"}</h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="btn btn--secondary"
                style={{ padding: "var(--space-8)", minWidth: "auto" }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "var(--space-24)" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  currentNote ? updateNote() : createNote()
                }}
              >
                <div style={{ marginBottom: "var(--space-20)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--space-8)",
                      fontWeight: "var(--font-weight-medium)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Enter note title"
                    required
                    style={{
                      width: "100%",
                      padding: "var(--space-12)",
                      fontSize: "var(--font-size-md)",
                      color: "var(--color-text)",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-base)",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "var(--space-20)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--space-8)",
                      fontWeight: "var(--font-weight-medium)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  >
                    Content
                  </label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Write your note here..."
                    required
                    style={{
                      width: "100%",
                      minHeight: "200px",
                      padding: "var(--space-12)",
                      fontSize: "var(--font-size-base)",
                      fontFamily: "inherit",
                      color: "var(--color-text)",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-base)",
                      resize: "vertical",
                    }}
                  />
                </div>
                {error && (
                  <div className="status status--error" style={{ marginBottom: "var(--space-16)" }}>
                    {error}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-12)",
                    justifyContent: "flex-end",
                    marginTop: "var(--space-24)",
                  }}
                >
                  <button type="button" className="btn btn--outline" onClick={() => setIsNoteModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary" disabled={creating}>
                    {creating ? "Saving..." : currentNote ? "Update Note" : "Save Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setIsProfileModalOpen(false)}>
          <div
            className="modal-content"
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--space-24) var(--space-24) var(--space-16)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <h3>Profile</h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="btn btn--secondary"
                style={{ padding: "var(--space-8)", minWidth: "auto" }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "var(--space-24)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "var(--space-16)" }}>
                  <span style={{ fontSize: "80px", color: "var(--color-primary)" }}>👤</span>
                </div>
                <div>
                  <h4 style={{ marginBottom: "var(--space-8)", fontSize: "var(--font-size-xl)" }}>
                    {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                  </h4>
                  <p style={{ marginBottom: "var(--space-8)", color: "var(--color-text-secondary)" }}>{user?.email}</p>
                  <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>
                    Member since {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                  <div
                    style={{
                      marginTop: "var(--space-16)",
                      padding: "var(--space-8)",
                      background: "var(--color-secondary)",
                      borderRadius: "var(--radius-base)",
                    }}
                  >
                    <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-success)" }}>
                      ✅ Email Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setIsDeleteModalOpen(false)}>
          <div
            className="modal-content"
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--space-24) var(--space-24) var(--space-16)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <h3>Delete Note</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn--secondary"
                style={{ padding: "var(--space-8)", minWidth: "auto" }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "var(--space-24)" }}>
              <p>Are you sure you want to delete this note? This action cannot be undone.</p>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-12)",
                  justifyContent: "flex-end",
                  marginTop: "var(--space-24)",
                }}
              >
                <button type="button" className="btn btn--outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => noteToDelete && deleteNote(noteToDelete)}
                  style={{
                    background: "var(--color-error)",
                    color: "white",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
