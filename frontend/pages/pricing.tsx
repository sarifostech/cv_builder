import { useState } from 'react';
import Head from 'next/head';
import Button from '@/components/Button';

export default function Pricing() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <>
      <Head>
        <title>Pricing – CV Creator</title>
      </Head>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-600 mb-8">
            Choose the plan that fits your job search. No hidden fees, cancel anytime.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">Free</h2>
              <p className="mt-4 text-gray-600">
                Create and edit CVs with ATS-safe templates.
              </p>
              <p className="mt-4 text-4xl font-bold">$0</p>
              <ul className="mt-6 space-y-3 text-left text-gray-700">
                <li>✓ Unlimited CV drafts</li>
                <li>✓ ATS-safe templates</li>
                <li>✓ Basic autosave</li>
                <li>✗ PDF export (ATS-Safe only with upgrade)</li>
              </ul>
              <div className="mt-8">
                <Button onClick={() => {}} className="w-full justify-center">
                  Get Started
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-blue-600 relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                BEST VALUE
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Pro</h2>
              <p className="mt-4 text-gray-600">
                Export high-quality PDFs and unlock all templates.
              </p>
              <p className="mt-4 text-4xl font-bold">$12<span className="text-lg font-normal">/mo</span></p>
              <p className="text-gray-500">or $99/yr (save $45)</p>
              <ul className="mt-6 space-y-3 text-left text-gray-700">
                <li>✓ Everything in Free</li>
                <li>✓ Export ATS-Safe PDF</li>
                <li>✓ Export Visual PDF</li>
                <li>✓ Both formats together</li>
                <li>✓ All industry templates</li>
                <li>✓ 30-day money-back guarantee</li>
                <li>✓ Cancel anytime</li>
              </ul>
              <div className="mt-8">
                <Button variant="primary" onClick={() => setShowUpgradeModal(true)} className="w-full justify-center">
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Payments are secured via Stripe. By upgrading, you agree to our Terms of Service.
          </p>
        </div>
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
            <p className="text-gray-700 mb-4">
              Stripe integration is not yet implemented. This is a placeholder. In the final product, clicking “Upgrade” would take you to a secure checkout.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>Cancel</Button>
              <Button onClick={() => setShowUpgradeModal(false)}>Proceed to Checkout (placeholder)</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
