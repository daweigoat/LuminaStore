"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormValues } from "@/lib/validations";
import { MapPin, Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await api.get("/addresses");
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const addMutation = useMutation({
    mutationFn: (data: AddressFormValues) => api.post("/addresses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setIsModalOpen(false);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/addresses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  const onSubmit = (data: AddressFormValues) => {
    addMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 md:px-12 py-32 min-h-screen max-w-4xl">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Saved Addresses</h1>
          <p className="text-foreground/60">Manage your shipping and billing locations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-semibold hover:bg-foreground/90 transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" /> Add New
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : addresses?.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-16 flex flex-col items-center text-center">
          <MapPin className="w-12 h-12 text-foreground/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No addresses found</h3>
          <p className="text-foreground/60 mb-6">You haven't saved any delivery addresses yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {addresses?.map((addr: any) => (
            <motion.div 
              key={addr.ID}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border ${addr.IsDefault ? 'border-primary-500 bg-primary-500/5' : 'border-border bg-card'} flex justify-between items-start`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{addr.RecipientName}</h3>
                  {addr.IsDefault && (
                    <span className="bg-primary-500/20 text-primary-400 text-xs font-bold px-2 py-1 rounded-md">DEFAULT</span>
                  )}
                </div>
                <p className="text-foreground/80">{addr.Phone}</p>
                <p className="text-foreground/60 mt-2 max-w-sm">{addr.Street}, {addr.City}, {addr.State} {addr.PostalCode}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-border">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteMutation.mutate(addr.ID)}
                  className="p-2 hover:bg-danger/20 text-danger rounded-lg transition-colors border border-border"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-3xl p-8 w-full max-w-lg shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Add New Address</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Recipient Name</label>
                    <input {...register("recipient_name")} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
                    {errors.recipient_name && <p className="text-danger text-xs mt-1">{errors.recipient_name.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone</label>
                    <input {...register("phone")} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
                    {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Street Address</label>
                  <textarea {...register("street")} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" rows={3} />
                  {errors.street && <p className="text-danger text-xs mt-1">{errors.street.message}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">City</label>
                    <input {...register("city")} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">State</label>
                    <input {...register("state")} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Postal Code</label>
                    <input {...register("postal_code")} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" {...register("is_default")} className="w-4 h-4 rounded border-border" />
                  <label className="text-sm">Set as default address</label>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-border hover:bg-white/5 font-medium transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={addMutation.isPending} className="flex-1 bg-foreground text-background px-6 py-3 rounded-xl font-semibold hover:bg-foreground/90 transition-transform hover:scale-[1.02]">
                    {addMutation.isPending ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
