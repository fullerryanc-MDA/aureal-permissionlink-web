'use client';

/**
 * Permission Request Landing Page
 * URL: /permission-request?token=<requestId>
 */

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PermissionRequest, LandownerResponse } from '@/lib/types';
import PermissionRequestView from '@/components/PermissionRequestView';
import LandownerForm from '@/components/LandownerForm';

type PageState = 'loading' | 'loaded' | 'error' | 'expired' | 'submitted';

function PermissionRequestContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<PageState>('loading');
  const [request, setRequest] = useState<PermissionRequest | null>(null);
  const [error, setError] = useState<string>('');

  const requestId = searchParams.get('token');

  // Fetch permission request on mount
  useEffect(() => {
    if (!requestId) {
      setState('error');
      setError('Invalid permission request link');
      return;
    }

    fetchPermissionRequest();
  }, [requestId]);

  const fetchPermissionRequest = async () => {
    try {
      setState('loading');

      const response = await fetch(`/api/permission-requests/${requestId}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 410 && data.expired) {
          setState('expired');
          setError('This permission request has expired');
          return;
        }

        throw new Error(data.error || 'Failed to load permission request');
      }

      setRequest(data.data);
      setState('loaded');
    } catch (err: any) {
      console.error('Error fetching request:', err);
      setState('error');
      setError(err.message || 'Failed to load permission request');
    }
  };

  const handleSubmitResponse = async (response: LandownerResponse) => {
    try {
      const res = await fetch(`/api/permission-requests/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit response');
      }

      setState('submitted');
      setRequest(data.data); // Update with responded request
    } catch (err: any) {
      console.error('Error submitting response:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Loading state
  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-aureal-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-aureal-text-secondary text-lg">Loading permission request...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === 'error' || state === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-lg text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-aureal-text-primary mb-2">
            {state === 'expired' ? 'Request Expired' : 'Invalid Request'}
          </h1>
          <p className="text-aureal-text-secondary mb-6">{error}</p>
          <p className="text-sm text-aureal-text-muted">
            Please ask the detectorist to generate a new permission request link.
          </p>
        </div>
      </div>
    );
  }

  // Submitted state
  if (state === 'submitted' && request) {
    const isApproved = request.status === 'approved';

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-lg text-center">
          <div className="text-6xl mb-4">{isApproved ? '✅' : '❌'}</div>
          <h1 className="text-2xl font-bold text-aureal-text-primary mb-2">
            Request {isApproved ? 'Approved' : 'Denied'}
          </h1>
          <p className="text-aureal-text-secondary mb-6">
            {isApproved
              ? `You've approved ${request.requesterName}'s permission request. They will be notified.`
              : `You've denied this permission request. The detectorist will be notified.`}
          </p>
          <button
            onClick={() => window.close()}
            className="btn-secondary"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  // Main view with request details and form
  if (!request) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-aureal-gold to-yellow-300 bg-clip-text text-transparent">
              AUREAL
            </span>
          </h1>
          <p className="text-aureal-text-secondary">Metal Detecting & Outdoor Activities</p>
        </div>

        {/* Permission Request Details */}
        <PermissionRequestView request={request} />

        {/* Landowner Response Form */}
        <div className="mt-8">
          <LandownerForm onSubmit={handleSubmitResponse} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-aureal-text-muted">
          <p>Powered by Aureal | Responsible Outdoor Recreation</p>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense to handle useSearchParams
export default function PermissionRequestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-aureal-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-aureal-text-secondary text-lg">Loading...</p>
        </div>
      </div>
    }>
      <PermissionRequestContent />
    </Suspense>
  );
}
