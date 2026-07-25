"use client";

import { Star, MessageSquareReply } from "lucide-react";

export default function SellerReviews() {
  const mockReviews = [
    { id: 1, product: "Lumina Pro Max", rating: 5, user: "Rian", date: "2026-07-24", comment: "Amazing product! Very premium.", reply: null },
    { id: 2, product: "Lumina Pro Max", rating: 4, user: "Alex", date: "2026-07-20", comment: "Good, but shipping took a while.", reply: "We apologize for the delay, we have switched couriers!" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Customer Reviews</h1>
        <p className="text-foreground/60">Read and respond to feedback from your customers.</p>
      </div>

      <div className="space-y-4">
        {mockReviews.map(review => (
          <div key={review.id} className="bg-card border border-border rounded-3xl p-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <div className="flex text-warning mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-warning' : 'text-foreground/20'}`} />
                ))}
              </div>
              <p className="font-bold">{review.user}</p>
              <p className="text-xs text-foreground/50">{review.date}</p>
              <p className="text-sm font-medium mt-2 text-primary-400">{review.product}</p>
            </div>
            
            <div className="w-full md:w-3/4 flex flex-col justify-between">
              <p className="text-foreground/80 mb-4">"{review.comment}"</p>
              
              {review.reply ? (
                <div className="bg-background rounded-xl p-4 border border-border mt-4">
                  <p className="text-xs font-bold text-success mb-1 flex items-center gap-1"><MessageSquareReply className="w-3 h-3"/> Your Reply</p>
                  <p className="text-sm text-foreground/70">{review.reply}</p>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2">
                  <input type="text" placeholder="Write a reply..." className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-500" />
                  <button className="bg-foreground text-background font-semibold px-4 py-2 rounded-lg text-sm hover:bg-foreground/90 transition-colors">Reply</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
