/**
 * Home Page / Landing Page
 * Redirects or shows information about Aureal
 */

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <h1 className="text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-aureal-gold to-yellow-300 bg-clip-text text-transparent">
            AUREAL
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-2xl text-aureal-text-secondary mb-12">
          Metal Detecting & Outdoor Activities
        </p>

        {/* Card */}
        <div className="card max-w-lg mx-auto">
          <div className="text-5xl mb-6">🔍</div>
          <h2 className="text-2xl font-bold text-aureal-gold mb-4">
            PermissionLink™
          </h2>
          <p className="text-aureal-text-secondary mb-6">
            Secure permission management for metal detectorists and landowners.
            Build trust, respect boundaries, and enjoy responsible outdoor recreation.
          </p>

          {/* Info */}
          <div className="bg-aureal-blue/10 border border-aureal-blue/30 rounded-lg p-4 text-left">
            <p className="text-sm text-aureal-text-secondary mb-3">
              <strong className="text-aureal-blue">For Detectorists:</strong><br />
              Generate secure permission requests via the Aureal mobile app.
            </p>
            <p className="text-sm text-aureal-text-secondary">
              <strong className="text-aureal-blue">For Landowners:</strong><br />
              Click the link in your permission request to review and respond.
            </p>
          </div>
        </div>

        {/* Download Links */}
        <div className="mt-12 flex gap-4 justify-center">
          <a
            href="https://apps.apple.com/app/aureal"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span className="text-2xl">📱</span>
            Download for iOS
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.aureal.app"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <span className="text-2xl">🤖</span>
            Download for Android
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 text-sm text-aureal-text-muted">
          <p>&copy; 2024 Aureal. All rights reserved.</p>
          <p className="mt-2">Responsible Outdoor Recreation</p>
        </div>
      </div>
    </div>
  );
}
