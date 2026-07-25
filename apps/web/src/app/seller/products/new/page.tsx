"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { api } from "@/lib/api";
import { ArrowLeft, UploadCloud, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  price: z.number().min(0),
  stock: z.number().min(0),
  weight: z.number().min(0),
  length: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),
  brand: z.string(),
  category_id: z.string().uuid(),
  status: z.enum(["published", "draft"]),
  variants: z.array(
    z.object({
      name: z.string(),
      sku: z.string(),
      price: z.number(),
      stock: z.number()
    })
  )
});

type ProductForm = z.infer<typeof productSchema>;

export default function NewProduct() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const { register, control, handleSubmit, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "published",
      variants: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  const onSubmit = async (data: ProductForm) => {
    setIsSubmitting(true);
    try {
      // Create slug from name
      const slug = data.name.toLowerCase().replace(/\\s+/g, '-');
      await api.post("/seller/products", { ...data, slug });
      router.push("/seller/products");
    } catch (error) {
      console.error("Failed to create product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/seller/products" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>
      
      <h1 className="text-3xl font-bold tracking-tight mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Product Name</label>
              <input {...register("name")} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" placeholder="e.g. Lumina Pro Max" />
              {errors.name && <span className="text-danger text-sm mt-1">{errors.name.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea {...register("description")} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" placeholder="Describe your product..."></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Category ID (UUID)</label>
                <input {...register("category_id")} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Brand</label>
                <input {...register("brand")} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">Pricing & Inventory</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Base Price ($)</label>
              <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Base Stock</label>
              <input type="number" {...register("stock", { valueAsNumber: true })} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Product Variants</h2>
            <button type="button" onClick={() => append({ name: "", sku: "", price: 0, stock: 0 })} className="text-sm font-semibold text-primary-400 flex items-center gap-1 hover:underline">
              <Plus className="w-4 h-4" /> Add Variant
            </button>
          </div>
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-4 items-end bg-background p-4 rounded-xl border border-border">
                <div className="col-span-4">
                  <label className="block text-xs font-semibold mb-1">Variant Name (e.g. Size M, Red)</label>
                  <input {...register(`variants.${index}.name`)} className="w-full bg-card border border-border rounded-lg px-3 py-2 outline-none" />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-semibold mb-1">SKU</label>
                  <input {...register(`variants.${index}.sku`)} className="w-full bg-card border border-border rounded-lg px-3 py-2 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1">Price</label>
                  <input type="number" {...register(`variants.${index}.price`, { valueAsNumber: true })} className="w-full bg-card border border-border rounded-lg px-3 py-2 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1">Stock</label>
                  <input type="number" {...register(`variants.${index}.stock`, { valueAsNumber: true })} className="w-full bg-card border border-border rounded-lg px-3 py-2 outline-none" />
                </div>
                <div className="col-span-1 flex justify-end pb-2">
                  <button type="button" onClick={() => remove(index)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg"><Trash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {fields.length === 0 && <p className="text-foreground/50 text-sm">No variants added. The base price and stock will be used.</p>}
          </div>
        </div>

        {/* Shipping & Dimensions */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">Shipping & Dimensions</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Weight (g)</label>
              <input type="number" {...register("weight", { valueAsNumber: true })} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Length (cm)</label>
              <input type="number" {...register("length", { valueAsNumber: true })} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Width (cm)</label>
              <input type="number" {...register("width", { valueAsNumber: true })} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Height (cm)</label>
              <input type="number" {...register("height", { valueAsNumber: true })} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/seller/products" className="px-6 py-3 font-semibold rounded-xl hover:bg-white/5 transition-colors">Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="bg-foreground text-background font-semibold px-8 py-3 rounded-xl hover:bg-foreground/90 transition-colors disabled:opacity-50">
            {isSubmitting ? "Publishing..." : "Publish Product"}
          </button>
        </div>

      </form>
    </div>
  );
}
