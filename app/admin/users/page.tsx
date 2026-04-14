"use client";

import { useState, useCallback } from "react";
import { useAdminUsers, useUpdateUser, useDeleteUser } from "@/hooks/admin/use-users";
import type { UserRole, UserStatus, UserFilters } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  UserX,
  Shield,
  Trash2,
  Eye,
  Download,
  Filter,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const roleBadgeStyles: Record<UserRole, string> = {
  admin: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  moderator: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  user: "bg-white/5 text-white/50 border-white/10",
};

const statusBadgeStyles: Record<UserStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  suspended: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  banned: "bg-red-500/10 text-red-400 border-red-500/20",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    page_size: 10,
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialogUser, setDeleteDialogUser] = useState<string | null>(null);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);

  const { data, isLoading } = useAdminUsers(filters);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  // Debounced search
  const handleSearch = useCallback(
    (value: string) => {
      setSearchInput(value);
      const timeout = setTimeout(() => {
        setFilters((f) => ({ ...f, search: value, page: 1 }));
      }, 300);
      return () => clearTimeout(timeout);
    },
    []
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!data) return;
    if (selectedIds.size === data.results.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.results.map((u) => u.id)));
    }
  };

  const handleStatusChange = (userId: string, status: UserStatus) => {
    updateUser.mutate(
      { userId, updates: { status } },
      {
        onSuccess: () => {
          toast.success(
            `User ${status === "active" ? "activated" : status}`,
            { description: `User has been ${status}` }
          );
        },
      }
    );
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUser.mutate(
      { userId, updates: { role } },
      {
        onSuccess: () => {
          toast.success("Role updated", {
            description: `User role changed to ${role}`,
          });
        },
      }
    );
  };

  const handleDelete = (userId: string) => {
    deleteUser.mutate(userId, {
      onSuccess: () => {
        toast.success("User deleted", {
          description: "User account has been permanently removed",
        });
        setDeleteDialogUser(null);
      },
    });
  };

  const totalPages = Math.ceil((data?.count || 0) / (filters.page_size || 10));
  const detailUser = data?.results.find((u) => u.id === detailUserId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Users
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Manage all registered accounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-white/[0.06] bg-white/[0.03] pl-10 text-white placeholder:text-white/25 focus-visible:ring-amber-500/30"
          />
        </div>
        <Select
          value={filters.role || "all"}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              role: v === "all" ? undefined : (v as UserRole),
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-[140px] border-white/[0.06] bg-white/[0.03] text-white/60">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#1a1a2e]">
            <SelectItem value="all" className="text-white/60">All Roles</SelectItem>
            <SelectItem value="admin" className="text-white/60">Admin</SelectItem>
            <SelectItem value="moderator" className="text-white/60">Moderator</SelectItem>
            <SelectItem value="user" className="text-white/60">User</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status || "all"}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              status: v === "all" ? undefined : (v as UserStatus),
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-[150px] border-white/[0.06] bg-white/[0.03] text-white/60">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#1a1a2e]">
            <SelectItem value="all" className="text-white/60">All Status</SelectItem>
            <SelectItem value="active" className="text-white/60">Active</SelectItem>
            <SelectItem value="suspended" className="text-white/60">Suspended</SelectItem>
            <SelectItem value="banned" className="text-white/60">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <span className="text-sm font-medium text-amber-400">
            {selectedIds.size} selected
          </span>
          <Button
            size="sm"
            variant="outline"
            className="border-orange-500/20 text-orange-400 hover:bg-orange-500/10"
            onClick={() =>
              selectedIds.forEach((id) => handleStatusChange(id, "suspended"))
            }
          >
            <UserX className="mr-1 h-3.5 w-3.5" />
            Suspend
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            onClick={() => {
              /* batch delete */
            }}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d0d14]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3.5 text-left">
                  <Checkbox
                    checked={
                      data &&
                      data.results.length > 0 &&
                      selectedIds.size === data.results.length
                    }
                    onCheckedChange={toggleSelectAll}
                    className="border-white/20"
                  />
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                  User
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                  Role
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                  Status
                </th>
                <th className="hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30 lg:table-cell">
                  Joined
                </th>
                <th className="hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30 lg:table-cell">
                  Last Active
                </th>
                <th className="hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30 md:table-cell">
                  Conversations
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-white/30">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3.5">
                        <Skeleton className="h-4 w-4 bg-white/[0.06]" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-9 w-9 rounded-full bg-white/[0.06]" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-3.5 w-28 bg-white/[0.06]" />
                            <Skeleton className="h-3 w-36 bg-white/[0.06]" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Skeleton className="h-5 w-16 bg-white/[0.06]" />
                      </td>
                      <td className="px-4 py-3.5">
                        <Skeleton className="h-5 w-16 bg-white/[0.06]" />
                      </td>
                      <td className="hidden px-4 py-3.5 lg:table-cell">
                        <Skeleton className="h-3.5 w-20 bg-white/[0.06]" />
                      </td>
                      <td className="hidden px-4 py-3.5 lg:table-cell">
                        <Skeleton className="h-3.5 w-20 bg-white/[0.06]" />
                      </td>
                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <Skeleton className="h-3.5 w-10 bg-white/[0.06]" />
                      </td>
                      <td className="px-4 py-3.5">
                        <Skeleton className="ml-auto h-8 w-8 bg-white/[0.06]" />
                      </td>
                    </tr>
                  ))
                : data?.results.map((user) => (
                    <tr
                      key={user.id}
                      className="group transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3.5">
                        <Checkbox
                          checked={selectedIds.has(user.id)}
                          onCheckedChange={() => toggleSelect(user.id)}
                          className="border-white/20"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          className="flex items-center gap-3 text-left"
                          onClick={() => setDetailUserId(user.id)}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 text-xs font-bold text-amber-400">
                            {user.first_name[0]}
                            {user.last_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white/80 group-hover:text-white">
                              {user.full_name}
                            </p>
                            <p className="text-xs text-white/30">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[11px] capitalize",
                            roleBadgeStyles[user.role]
                          )}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[11px] capitalize",
                            statusBadgeStyles[user.status]
                          )}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="hidden px-4 py-3.5 text-xs text-white/40 lg:table-cell">
                        {formatDate(user.date_joined)}
                      </td>
                      <td className="hidden px-4 py-3.5 text-xs text-white/40 lg:table-cell">
                        {formatDate(user.last_active)}
                      </td>
                      <td className="hidden px-4 py-3.5 text-sm text-white/50 md:table-cell">
                        {user.total_conversations}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-white/30 hover:bg-white/[0.06] hover:text-white/60"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 border-white/10 bg-[#1a1a2e]"
                          >
                            <DropdownMenuItem
                              className="text-white/60 focus:bg-white/[0.06] focus:text-white"
                              onClick={() => setDetailUserId(user.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/[0.06]" />
                            <DropdownMenuItem
                              className="text-white/60 focus:bg-white/[0.06] focus:text-white"
                              onClick={() => handleRoleChange(user.id, "admin")}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-white/60 focus:bg-white/[0.06] focus:text-white"
                              onClick={() =>
                                handleRoleChange(user.id, "moderator")
                              }
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Make Moderator
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/[0.06]" />
                            {user.status === "active" ? (
                              <DropdownMenuItem
                                className="text-orange-400 focus:bg-orange-500/10 focus:text-orange-400"
                                onClick={() =>
                                  handleStatusChange(user.id, "suspended")
                                }
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Suspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-400"
                                onClick={() =>
                                  handleStatusChange(user.id, "active")
                                }
                              >
                                <Users className="mr-2 h-4 w-4" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
                              onClick={() => setDeleteDialogUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/30">
            Showing{" "}
            {data
              ? `${((filters.page || 1) - 1) * (filters.page_size || 10) + 1}–${Math.min(
                  (filters.page || 1) * (filters.page_size || 10),
                  data.count
                )} of ${data.count}`
              : "..."}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={!data?.previous}
              onClick={() =>
                setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))
              }
              className="h-8 w-8 p-0 text-white/30 hover:bg-white/[0.06] hover:text-white/60"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                className={cn(
                  "h-8 w-8 p-0 text-xs",
                  (filters.page || 1) === i + 1
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-white/30 hover:bg-white/[0.06] hover:text-white/60"
                )}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              disabled={!data?.next}
              onClick={() =>
                setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))
              }
              className="h-8 w-8 p-0 text-white/30 hover:bg-white/[0.06] hover:text-white/60"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* User Detail Panel */}
      <Dialog open={!!detailUserId} onOpenChange={() => setDetailUserId(null)}>
        <DialogContent className="max-w-lg border-white/[0.06] bg-[#0d0d14] text-white">
          {detailUser && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 text-lg font-bold text-amber-400">
                    {detailUser.first_name[0]}
                    {detailUser.last_name[0]}
                  </div>
                  <div>
                    <DialogTitle className="text-lg">
                      {detailUser.full_name}
                    </DialogTitle>
                    <DialogDescription className="text-white/40">
                      {detailUser.email}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[11px] font-medium uppercase text-white/30">
                      Role
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-1 capitalize",
                        roleBadgeStyles[detailUser.role]
                      )}
                    >
                      {detailUser.role}
                    </Badge>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[11px] font-medium uppercase text-white/30">
                      Status
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-1 capitalize",
                        statusBadgeStyles[detailUser.status]
                      )}
                    >
                      {detailUser.status}
                    </Badge>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[11px] font-medium uppercase text-white/30">
                      Joined
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {formatDate(detailUser.date_joined)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[11px] font-medium uppercase text-white/30">
                      Last Active
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {formatDate(detailUser.last_active)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3 col-span-2">
                    <p className="text-[11px] font-medium uppercase text-white/30">
                      Total Conversations
                    </p>
                    <p className="mt-1 text-2xl font-bold text-white">
                      {detailUser.total_conversations}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {detailUser.status === "active" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-orange-500/20 text-orange-400 hover:bg-orange-500/10"
                      onClick={() =>
                        handleStatusChange(detailUser.id, "suspended")
                      }
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() =>
                        handleStatusChange(detailUser.id, "active")
                      }
                    >
                      Activate
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10"
                    onClick={() => setDeleteDialogUser(detailUser.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteDialogUser}
        onOpenChange={() => setDeleteDialogUser(null)}
      >
        <DialogContent className="max-w-sm border-white/[0.06] bg-[#0d0d14] text-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-white/40">
              This action cannot be undone. The user account and all associated
              data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogUser(null)}
              className="border-white/10 text-white/60 hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteDialogUser && handleDelete(deleteDialogUser)}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
