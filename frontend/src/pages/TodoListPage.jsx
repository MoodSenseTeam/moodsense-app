import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, ListTodo, Plus, Square, Trash2, X } from "lucide-react";
import { useAuth } from "../contexts/useAuth";
import { createTodo, deleteTodo, fetchTodos, toggleTodo } from "../lib/todos";

const INITIAL_FORM = { name: "", description: "", duration: "" };

function TodoListPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingIds, setTogglingIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadTodos = useCallback(async () => {
    if (!accessToken) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchTodos(accessToken);
      setTodos(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat todo list.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  async function handleToggle(todo) {
    if (!accessToken || togglingIds.has(todo.todo_id)) return;

    setTogglingIds((prev) => new Set(prev).add(todo.todo_id));

    setTodos((prev) =>
      prev.map((item) =>
        item.todo_id === todo.todo_id
          ? { ...item, is_completed: !item.is_completed, completed_at: !item.is_completed ? new Date().toISOString() : null }
          : item,
      ),
    );

    try {
      await toggleTodo(todo.todo_id, accessToken);
    } catch {
      setTodos((prev) =>
        prev.map((item) =>
          item.todo_id === todo.todo_id
            ? { ...item, is_completed: todo.is_completed, completed_at: todo.completed_at }
            : item,
        ),
      );
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(todo.todo_id);
        return next;
      });
    }
  }

  async function handleDelete(todo) {
    if (!accessToken || deletingIds.has(todo.todo_id)) return;

    setDeletingIds((prev) => new Set(prev).add(todo.todo_id));

    // Optimistic remove
    setTodos((prev) => prev.filter((item) => item.todo_id !== todo.todo_id));

    try {
      await deleteTodo(todo.todo_id, accessToken);
    } catch {
      // Revert on failure
      setTodos((prev) => [...prev, todo].sort((a, b) => a.todo_id - b.todo_id));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(todo.todo_id);
        return next;
      });
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!accessToken || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setFormError(null);
      const result = await createTodo(form, accessToken);
      setTodos((prev) => [...prev, result.data]);
      setForm(INITIAL_FORM);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menambah todo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const completedCount = todos.filter((t) => t.is_completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="mx-auto max-w-330">
      <header className="mb-8 pl-14 lg:pl-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${allDone ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-[#edf8f2] dark:bg-emerald-900/30"}`}>
              <ListTodo size={24} className={allDone ? "text-emerald-600 dark:text-emerald-400" : "text-[#2b6a4f] dark:text-emerald-400"} />
            </div>
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-[#1f3f31] dark:text-white md:text-4xl">Todo List</h1>
              <p className="mt-2 text-base text-[#375446] dark:text-slate-300 md:text-lg">
                Rekomendasi personal dari AI
              </p>
            </div>
          </div>

          <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
            showForm
              ? "bg-slate-100 text-[#375446] hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              : "bg-[#2b6a4f] text-white hover:bg-[#245a43] dark:bg-emerald-600 dark:hover:bg-emerald-500"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Batal" : "Tambah"}
        </button>
        </div>
      </header>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 rounded-2xl border border-[#e2e8e4] bg-white p-5 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-[#60766b] dark:text-slate-400 mb-1.5">Nama</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Jalan Pagi"
                className="w-full rounded-xl border border-[#e2e8e4] bg-white px-3.5 py-2.5 text-sm text-[#1f3f31] placeholder:text-slate-300 focus:border-[#19c58f] focus:outline-none focus:ring-2 focus:ring-[#19c58f]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#60766b] dark:text-slate-400 mb-1.5">Deskripsi</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Kenapa ini membantu?"
                className="w-full rounded-xl border border-[#e2e8e4] bg-white px-3.5 py-2.5 text-sm text-[#1f3f31] placeholder:text-slate-300 focus:border-[#19c58f] focus:outline-none focus:ring-2 focus:ring-[#19c58f]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#60766b] dark:text-slate-400 mb-1.5">Durasi</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="15 menit"
                className="w-full rounded-xl border border-[#e2e8e4] bg-white px-3.5 py-2.5 text-sm text-[#1f3f31] placeholder:text-slate-300 focus:border-[#19c58f] focus:outline-none focus:ring-2 focus:ring-[#19c58f]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {formError && (
            <p className="mt-3 text-xs text-red-500 dark:text-red-400">{formError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2b6a4f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#245a43] disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Todo"}
          </button>
        </form>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="mt-8 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/80 animate-pulse">
              <div className="mt-0.5 h-5 w-5 rounded-md bg-slate-200 dark:bg-slate-700/80" />
              <div className="flex-1 space-y-2.5">
                <div className="h-4 w-2/5 rounded-md bg-slate-200 dark:bg-slate-700/80" />
                <div className="h-3 w-full rounded-md bg-slate-100 dark:bg-slate-700/50" />
              </div>
              <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700/80" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50/80 p-8 dark:border-red-900/30 dark:bg-red-950/20">
          <p className="text-sm leading-relaxed text-red-600 dark:text-red-300/90">{error}</p>
          <button
            type="button"
            onClick={loadTodos}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800/40 dark:text-red-300 dark:hover:bg-red-900/40 transition"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && totalCount === 0 && !showForm && (
        <div className="mt-8 flex flex-col items-center py-20 text-center rounded-2xl border border-[#e2e8e4] bg-white dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/70">
            <ListTodo size={40} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h2 className="mt-6 text-lg font-semibold text-[#1f3f31] dark:text-slate-100">Belum ada todo</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#60766b] dark:text-slate-400 max-w-sm">
            Lakukan check-in harian untuk mendapatkan rekomendasi personal dari AI, atau tambahkan todo sendiri.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/tracker")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2b6a4f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#245a43] dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-sm"
            >
              Mulai Check-in
            </button>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8e4] bg-white px-5 py-2.5 text-sm font-semibold text-[#2b6a4f] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-slate-800 transition-colors"
            >
              <Plus size={18} />
              Tambah Manual
            </button>
          </div>
        </div>
      )}

      {/* Todo List */}
      {!isLoading && !error && totalCount > 0 && (
        <>
          {/* Progress Card */}
          <div className="mt-8 rounded-2xl border border-[#e2e8e4] bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-medium text-[#60766b] dark:text-slate-400">
                  {completedCount} dari {totalCount} selesai
                </span>
                <span className="ml-2 text-xs text-[#9ca9a1] dark:text-slate-500">· reset setiap hari</span>
              </div>
              <div className="flex items-center gap-3">
                {allDone && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    🎉 Semua selesai!
                  </span>
                )}
                <span className="text-sm font-semibold text-[#2b6a4f] dark:text-emerald-400">{progressPercent}%</span>
              </div>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  allDone
                    ? "bg-emerald-400 dark:bg-emerald-500"
                    : "bg-gradient-to-r from-[#19c58f] to-[#2b6a4f] dark:from-emerald-500 dark:to-emerald-400"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="mt-4 space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.todo_id}
                className={`group flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-all duration-200 ${
                  todo.is_completed
                    ? "border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/20 dark:bg-emerald-950/20"
                    : "border-[#e2e8e4] bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:hover:bg-slate-800/80"
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggle(todo)}
                  disabled={togglingIds.has(todo.todo_id)}
                  className={`mt-0.5 shrink-0 transition-colors ${
                    todo.is_completed
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-slate-300 hover:text-[#19c58f] dark:text-slate-600 dark:hover:text-emerald-400"
                  } ${togglingIds.has(todo.todo_id) ? "pointer-events-none opacity-60" : ""}`}
                >
                  {todo.is_completed ? <CheckSquare size={22} /> : <Square size={22} />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className={`text-base font-semibold transition-all ${
                        todo.is_completed
                          ? "text-[#60766b] line-through dark:text-slate-500"
                          : "text-[#1f3f31] dark:text-slate-200"
                      }`}
                    >
                      {todo.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 transition-colors ${
                        todo.is_completed
                          ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                          : "bg-[#edf8f2] text-[#2b6a4f] dark:bg-emerald-950/30 dark:text-emerald-400"
                      }`}>
                        {todo.duration}
                      </span>
                      {todo.source === "MANUAL" && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 shrink-0">
                          Manual
                        </span>
                      )}
                    </div>
                  </div>
                  <p
                    className={`mt-1.5 text-sm leading-relaxed transition-all ${
                      todo.is_completed
                        ? "text-[#9ca9a1] line-through dark:text-slate-600"
                        : "text-[#60766b] dark:text-slate-400"
                    }`}
                  >
                    {todo.description}
                  </p>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(todo)}
                  disabled={deletingIds.has(todo.todo_id)}
                  className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"
                  title="Hapus todo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TodoListPage;
