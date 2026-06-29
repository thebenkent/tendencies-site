import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/merch/db'
import PageHeader from '@/components/admin/PageHeader'
import FormField from '@/components/admin/FormField'

export const dynamic = 'force-dynamic'

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant   = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Platform configuration, branding, and preferences."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Settings' }]}
      />

      <div className="p-6 max-w-2xl">
        {/* Branding section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Branding</h2>
          </div>
          <div className="px-6 py-2">
            <FormField label="Organisation name" htmlFor="name" horizontal hint="Displayed in the storefront header and emails.">
              <input
                id="name"
                defaultValue={tenant.name}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
              />
            </FormField>
            <FormField label="Contact email" htmlFor="email" horizontal>
              <input
                id="email"
                type="email"
                defaultValue={tenant.contact_email ?? ''}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
              />
            </FormField>
            <FormField label="Primary colour" htmlFor="primary" horizontal hint="Used for headers, backgrounds, and key UI elements.">
              <div className="flex items-center gap-2">
                <input type="color" defaultValue={tenant.primary_color} className="h-9 w-14 rounded border border-gray-300 p-1 cursor-pointer" />
                <input defaultValue={tenant.primary_color} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
              </div>
            </FormField>
            <FormField label="Accent colour" htmlFor="accent" horizontal hint="Used for buttons, highlights, and call-to-action elements.">
              <div className="flex items-center gap-2">
                <input type="color" defaultValue={tenant.secondary_color} className="h-9 w-14 rounded border border-gray-300 p-1 cursor-pointer" />
                <input defaultValue={tenant.secondary_color} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
              </div>
            </FormField>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              disabled
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium opacity-50 cursor-not-allowed"
              title="Settings editing coming in Phase 7E"
            >
              Save changes
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800 font-medium">Full settings editor coming in Phase 7E</p>
          <p className="text-xs text-amber-700 mt-1">
            Email configuration, shipping, taxes, checkout options, and platform integrations will be managed here.
          </p>
        </div>
      </div>
    </div>
  )
}
