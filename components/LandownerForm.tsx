'use client';

/**
 * Landowner Response Form
 * Allows landowner to approve or deny the permission request
 */

import { useState, FormEvent } from 'react';
import type { LandownerResponse } from '@/lib/types';

interface Props {
  onSubmit: (response: LandownerResponse) => Promise<void>;
}

export default function LandownerForm({ onSubmit }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    landownerName: '',
    landownerEmail: '',
    landownerPhone: '',
    notes: '',
  });

  const handleSubmit = async (status: 'approved' | 'denied') => {
    // Validate required fields
    if (!formData.landownerName.trim()) {
      alert('Please enter your name before responding');
      return;
    }

    // Confirm denial
    if (status === 'denied') {
      if (!confirm('Are you sure you want to deny this permission request?')) {
        return;
      }
    }

    setSubmitting(true);

    try {
      await onSubmit({
        status,
        landownerName: formData.landownerName.trim(),
        landownerEmail: formData.landownerEmail.trim() || undefined,
        landownerPhone: formData.landownerPhone.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });
    } catch (error) {
      // Error handling is done in parent component
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-aureal-gold mb-6">Your Response</h2>

      <div className="space-y-6">
        {/* Landowner Name (Required) */}
        <div>
          <label htmlFor="landownerName" className="label">
            Your Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="landownerName"
            className="input"
            placeholder="Enter your full name"
            value={formData.landownerName}
            onChange={(e) => setFormData({ ...formData, landownerName: e.target.value })}
            required
            disabled={submitting}
          />
        </div>

        {/* Email (Optional) */}
        <div>
          <label htmlFor="landownerEmail" className="label">
            Email (Optional)
          </label>
          <input
            type="email"
            id="landownerEmail"
            className="input"
            placeholder="your@email.com"
            value={formData.landownerEmail}
            onChange={(e) => setFormData({ ...formData, landownerEmail: e.target.value })}
            disabled={submitting}
          />
        </div>

        {/* Phone (Optional) */}
        <div>
          <label htmlFor="landownerPhone" className="label">
            Phone (Optional)
          </label>
          <input
            type="tel"
            id="landownerPhone"
            className="input"
            placeholder="(555) 123-4567"
            value={formData.landownerPhone}
            onChange={(e) => setFormData({ ...formData, landownerPhone: e.target.value })}
            disabled={submitting}
          />
        </div>

        {/* Notes / Conditions */}
        <div>
          <label htmlFor="notes" className="label">
            Notes or Conditions (Optional)
          </label>
          <textarea
            id="notes"
            className="textarea"
            placeholder="Any additional terms, instructions, or restrictions you'd like to add..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            disabled={submitting}
            rows={4}
          />
          <p className="text-xs text-aureal-text-muted mt-2">
            Example: "You can hunt from 8am-5pm only. Please close all gates and stay away from livestock."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button
            onClick={() => handleSubmit('approved')}
            disabled={submitting}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <span className="text-xl">✓</span>
                Approve Request
              </>
            )}
          </button>

          <button
            onClick={() => handleSubmit('denied')}
            disabled={submitting}
            className="btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-red-400 hover:text-red-300"
          >
            <span className="text-xl">✕</span>
            Deny Request
          </button>
        </div>

        {/* Info Notice */}
        <div className="bg-aureal-blue/10 border border-aureal-blue/30 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-2xl">ℹ️</div>
            <div className="flex-1 text-sm text-aureal-text-secondary">
              <p className="font-semibold text-aureal-blue mb-1">What happens next?</p>
              <p>
                The detectorist will be notified of your decision via the Aureal app. If you approve,
                they'll be able to start their hunt during the approved dates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
