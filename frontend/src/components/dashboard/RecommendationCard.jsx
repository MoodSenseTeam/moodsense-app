import { useCallback, useEffect, useState } from "react";
import { CheckSquare, ListTodo, Square } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { fetchTodos, toggleTodo } from "../../lib/todos";

function RecommendationCard() {
  const { accessToken } = useAuth();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingIds, setTogglingIds] = useState(new Set());

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
          ? {
              ...item,
              is_completed: !item.is_completed,
              completed_at: !item.is_completed ? new Date().toISOString() : null,
            }
          : item,
      ),
    );

    try {
      await toggleTodo(todo.todo_id, accessToken);
    } catch {
      setTodos((prev) =>
        prev.map((item) =>
          item.todo_id === todo.todo_id
            ? {
                ...item,
                is_completed: todo.is_completed,
                completed_at: todo.completed_at,
              }
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

  const completedCount = todos.filter((t) => t.is_completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // --- Loading State ---
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf8f2] dark:bg-emerald-900/30">
            <ListTodo size={18} className="text-[#2b6a4f] dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-[#1f3f31] dark:text-slate-100">Todo List</h2>
        </div>
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50 animate-pulse">
              <div className="mt-0.5 h-5 w-5 rounded-md bg-slate-200 dark:bg-slate-700/80" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded-md bg-slate-200 dark:bg-slate-700/80" />
                <div className="h-3 w-full rounded-md bg-slate-100 dark:bg-slate-700/50" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50/80 p-6 shadow-sm dark:border-red-900/30 dark:bg-red-950/20 dark:shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
            <ListTodo size={18} className="text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Todo List</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-red-600 dark:text-red-300/90">{error}</p>
        <button
          type="button"
          onClick={loadTodos}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800/40 dark:text-red-300 dark:hover:bg-red-900/40"
        >
          Coba lagi
        </button>
      </section>
    );
  }

  // --- Empty State ---
  if (totalCount === 0) {
    return (
      <section className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf8f2] dark:bg-emerald-900/30">
            <ListTodo size={18} className="text-[#2b6a4f] dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-[#1f3f31] dark:text-slate-100">Todo List</h2>
        </div>
        <div className="mt-6 flex flex-col items-center py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/70">
            <ListTodo size={32} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#60766b] dark:text-slate-400">
            Belum ada todo — lakukan check-in untuk mendapatkan rekomendasi personal dari AI.
          </p>
        </div>
      </section>
    );
  }

  // --- All Complete ---
  const allDone = completedCount === totalCount;

  // --- Todo List ---
  return (
    <section className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${allDone ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-[#edf8f2] dark:bg-emerald-900/30"}`}>
          <ListTodo size={18} className={allDone ? "text-emerald-600 dark:text-emerald-400" : "text-[#2b6a4f] dark:text-emerald-400"} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[#1f3f31] dark:text-slate-100">
            Todo List
          </h2>
        </div>
        {allDone && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            🎉 Selesai!
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#60766b] dark:text-slate-400">
            {completedCount}/{totalCount} selesai
          </span>
          <span className="font-semibold text-[#2b6a4f] dark:text-emerald-400">{progressPercent}%</span>
        </div>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              allDone
                ? "bg-emerald-400 dark:bg-emerald-500"
                : "bg-gradient-to-r from-[#19c58f] to-[#2b6a4f] dark:from-emerald-500 dark:to-emerald-400"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="mt-4 space-y-2.5">
        {todos.map((todo) => (
          <button
            key={todo.todo_id}
            type="button"
            onClick={() => handleToggle(todo)}
            disabled={togglingIds.has(todo.todo_id)}
            className={`group flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
              todo.is_completed
                ? "border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/20 dark:bg-emerald-950/20"
                : "border-slate-100 bg-slate-50/40 hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700 dark:hover:bg-slate-800/70"
            } ${togglingIds.has(todo.todo_id) ? "pointer-events-none opacity-60" : ""}`}
          >
            <span className={`mt-0.5 shrink-0 transition-colors ${
              todo.is_completed
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-slate-300 group-hover:text-[#19c58f] dark:text-slate-600 dark:group-hover:text-emerald-400"
            }`}>
              {todo.is_completed ? <CheckSquare size={19} /> : <Square size={19} />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4
                  className={`text-sm font-semibold transition-all ${
                    todo.is_completed
                      ? "text-[#60766b] line-through dark:text-slate-500"
                      : "text-[#1f3f31] dark:text-slate-200"
                  }`}
                >
                  {todo.name}
                </h4>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                  todo.is_completed
                    ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                    : "bg-[#edf8f2] text-[#2b6a4f] dark:bg-emerald-950/30 dark:text-emerald-400"
                }`}>
                  {todo.duration}
                </span>
              </div>
              <p
                className={`mt-1 text-xs leading-relaxed transition-all ${
                  todo.is_completed
                    ? "text-[#9ca9a1] line-through dark:text-slate-600"
                    : "text-[#60766b] dark:text-slate-400"
                }`}
              >
                {todo.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default RecommendationCard;
