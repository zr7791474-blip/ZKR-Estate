"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Empty } from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { formatPrice } from "@/lib/utils";
import { propertySchema, PropertyInput } from "@/lib/validations";

interface Property {
  id: string;
  title: string;
  city: string;
  price: number;
  status: string;
  bedrooms: number;
  createdAt: string;
}

const statusOptions = [
  { value: "FOR_SALE", label: "For Sale" },
  { value: "FOR_RENT", label: "For Rent" },
  { value: "SOLD", label: "Sold" },
  { value: "RENTED", label: "Rented" }
];

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: "FOR_SALE",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      area: 80
    }
  });

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/properties");
    const data = await res.json();
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      title: "",
      description: "",
      price: 0,
      city: "",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      area: 80,
      images: "",
      status: "FOR_SALE"
    });
    setModalOpen(true);
  };

  const openEdit = (p: Property) => {
    setEditing(p);
    reset({
      title: p.title,
      description: "",
      price: p.price,
      city: p.city,
      type: "Apartment",
      bedrooms: p.bedrooms,
      bathrooms: 1,
      area: 80,
      images: "",
      status: p.status as any
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: PropertyInput) => {
    setSubmitting(true);
    setError(null);
    const url = editing ? `/api/properties/${editing.id}` : "/api/properties";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setSubmitting(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "Failed");
      return;
    }
    setModalOpen(false);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    load();
  };

  const columns = [
    { key: "title", header: "Title" },
    { key: "city", header: "City" },
    {
      key: "price",
      header: "Price",
      render: (r: Property) => formatPrice(r.price, r.status)
    },
    {
      key: "status",
      header: "Status",
      render: (r: Property) => (
        <Badge
          variant={
            r.status === "FOR_SALE"
              ? "success"
              : r.status === "FOR_RENT"
              ? "info"
              : "default"
          }
        >
          {r.status.replace("_", " ")}
        </Badge>
      )
    },
    {
      key: "actions",
      header: "",
      render: (r: Property) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(r.id)}
            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Properties</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Manage your listings.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add property
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          Loading...
        </div>
      ) : properties.length === 0 ? (
        <Empty
          title="No properties yet"
          description="Click 'Add property' to create your first listing."
        />
      ) : (
        <DataTable columns={columns} data={properties} keyExtractor={(r) => r.id} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit property" : "Add property"}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Title" error={errors.title?.message} {...register("title")} />
            <Input label="City" error={errors.city?.message} {...register("city")} />
          </div>
          <Textarea
            label="Description"
            error={errors.description?.message}
            {...register("description")}
          />
          <div className="grid gap-3 sm:grid-cols-4">
            <Input label="Price" type="number" error={errors.price?.message} {...register("price")} />
            <Input label="Bedrooms" type="number" error={errors.bedrooms?.message} {...register("bedrooms")} />
            <Input label="Bathrooms" type="number" error={errors.bathrooms?.message} {...register("bathrooms")} />
            <Input label="Area (m²)" type="number" error={errors.area?.message} {...register("area")} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              label="Type"
              options={[
                { value: "Apartment", label: "Apartment" },
                { value: "House", label: "House" },
                { value: "Condo", label: "Condo" },
                { value: "Villa", label: "Villa" },
                { value: "Land", label: "Land" }
              ]}
              {...register("type")}
            />
            <Select label="Status" options={statusOptions} {...register("status")} />
          </div>
          <Input
            label="Images (comma-separated URLs)"
            placeholder="https://..., https://..."
            error={errors.images?.message}
            {...register("images")}
          />
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editing ? "Save changes" : "Create property"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}