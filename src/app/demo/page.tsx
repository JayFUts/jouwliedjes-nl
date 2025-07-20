export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            JouwLiedjes.nl - Demo Mode
          </h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              ⚠️ Configuratie Vereist
            </h2>
            <p className="text-gray-700 mb-4">
              Deze site draait in demo mode. Om volledig te functioneren zijn de volgende configuraties nodig:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>✅ <strong>Netlify Deployment</strong> - Succesvol!</li>
              <li>❌ <strong>Database URL</strong> - Nog niet geconfigureerd</li>
              <li>❌ <strong>Suno Cookie</strong> - Nog niet geconfigureerd</li>
              <li>❌ <strong>Mollie API Key</strong> - Later toe te voegen</li>
              <li>❌ <strong>2Captcha Key</strong> - Later toe te voegen</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              🚀 Volgende Stappen
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Voeg de echte <code className="bg-gray-100 px-2 py-1 rounded">DATABASE_URL</code> toe in Netlify environment variables</li>
              <li>Voeg je <code className="bg-gray-100 px-2 py-1 rounded">SUNO_COOKIE</code> toe</li>
              <li>Update <code className="bg-gray-100 px-2 py-1 rounded">NEXTAUTH_URL</code> naar je eigen domein</li>
              <li>Test de applicatie functionaliteit</li>
              <li>Voeg later Mollie en 2Captcha toe voor volledige functionaliteit</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              ✨ Features (wanneer geconfigureerd)
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>AI muziek generatie met Suno.ai</li>
              <li>€5 per liedje met Mollie betalingen</li>
              <li>Gebruikersregistratie en login</li>
              <li>Persoonlijke liedjes bibliotheek</li>
              <li>Download je eigen liedjes</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Site URL: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXTAUTH_URL || 'https://jouwliedjes.netlify.app'}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}