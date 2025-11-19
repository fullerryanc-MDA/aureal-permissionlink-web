'use client';

/**
 * Permission Request Details Component
 * Displays request information in a card layout
 */

import type { PermissionRequest } from '@/lib/types';
import { ACTIVITY_LABELS } from '@/lib/types';
import { formatDate, calculateDuration } from '@/lib/permissions';
import PropertyMap from './PropertyMap';

interface Props {
  request: PermissionRequest;
}

export default function PermissionRequestView({ request }: Props) {
  const duration = calculateDuration(request.startDate, request.endDate);

  return (
    <div className="space-y-6">
      {/* Request Details Card */}
      <div className="card">
        <h2 className="text-2xl font-bold text-aureal-gold mb-6">Permission Request Details</h2>

        <div className="space-y-4">
          {/* Property Name */}
          <div className="info-row">
            <div className="text-3xl">📍</div>
            <div className="flex-1">
              <div className="text-xs text-aureal-text-muted uppercase tracking-wide mb-1">
                Property Name
              </div>
              <div className="text-lg font-semibold">{request.propertyName}</div>
            </div>
          </div>

          {/* Activity Type */}
          <div className="info-row">
            <div className="text-3xl">🏃</div>
            <div className="flex-1">
              <div className="text-xs text-aureal-text-muted uppercase tracking-wide mb-1">
                Activity Type
              </div>
              <div className="text-lg font-semibold">
                {ACTIVITY_LABELS[request.activityType]}
              </div>
            </div>
          </div>

          {/* Requested Duration */}
          <div className="info-row">
            <div className="text-3xl">📅</div>
            <div className="flex-1">
              <div className="text-xs text-aureal-text-muted uppercase tracking-wide mb-1">
                Requested Duration
              </div>
              <div className="text-lg font-semibold">
                {formatDate(request.startDate)} - {formatDate(request.endDate)}
              </div>
              <div className="text-sm text-aureal-text-secondary">
                {duration} {duration === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>

          {/* Requested By */}
          <div className="info-row">
            <div className="text-3xl">👤</div>
            <div className="flex-1">
              <div className="text-xs text-aureal-text-muted uppercase tracking-wide mb-1">
                Requested By
              </div>
              <div className="text-lg font-semibold">{request.requesterName}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Boundaries Map */}
      <div className="card">
        <h2 className="text-xl font-bold text-aureal-gold mb-4">Property Boundaries</h2>
        <PropertyMap bounds={request.bounds} />
        <p className="text-sm text-aureal-text-secondary text-center mt-4">
          Blue outline shows the requested area for this activity
        </p>
      </div>

      {/* Message from Detectorist */}
      {request.message && (
        <div className="card bg-aureal-blue/15 border-aureal-blue/30">
          <h3 className="text-lg font-semibold text-aureal-blue mb-3">
            Message from Detectorist
          </h3>
          <p className="text-aureal-text-secondary leading-relaxed whitespace-pre-wrap">
            {request.message}
          </p>
        </div>
      )}
    </div>
  );
}
