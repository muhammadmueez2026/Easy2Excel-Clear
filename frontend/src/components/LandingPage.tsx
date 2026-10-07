import React from 'react';
import {
  FileSpreadsheet,
  Zap,
  Lock,
  Smile,
  ChevronRight,
  CheckCircle,
  FileJson,
  BarChart3,
} from 'lucide-react';

interface LandingPageProps {
  onStartClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartClick }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-50 to-blue-100 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Messy Documents Into Clean Excel Files
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload a PDF, image, invoice, receipt, or table and let AI extract, clean,
              organize, and prepare your data for Excel.
            </p>
            <button
              onClick={onStartClick}
              className="bg-brand-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-700 transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Upload Your File
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Supported Formats */}
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <p className="text-center text-gray-600 font-medium mb-4">
              Supported File Formats:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['📄 PDF', '🖼️ JPG/JPEG', '🎨 PNG'].map((format) => (
                <span key={format} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            How It Works
          </h2>

          <div className="grid md:grid-cols-5 gap-6 mb-12">
            {[
              {
                step: '1',
                icon: <FileJson className="h-8 w-8" />,
                title: 'Upload',
                desc: 'Select your file',
              },
              {
                step: '2',
                icon: <Zap className="h-8 w-8" />,
                title: 'Extract',
                desc: 'AI extracts data',
              },
              {
                step: '3',
                icon: <BarChart3 className="h-8 w-8" />,
                title: 'Clean',
                desc: 'Structured & organized',
              },
              {
                step: '4',
                icon: <CheckCircle className="h-8 w-8" />,
                title: 'Review',
                desc: 'Edit if needed',
              },
              {
                step: '5',
                icon: <FileSpreadsheet className="h-8 w-8" />,
                title: 'Export',
                desc: 'Download Excel',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-brand-100 text-brand-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <div className="text-brand-600 mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8 text-brand-600" />,
                title: 'AI-Powered Extraction',
                desc: 'Advanced machine learning automatically extracts structured data from any document format.',
              },
              {
                icon: <Lock className="h-8 w-8 text-brand-600" />,
                title: 'Data Cleaning',
                desc: 'Automatic normalization of dates, currency, formatting, and duplicate detection.',
              },
              {
                icon: <Smile className="h-8 w-8 text-brand-600" />,
                title: 'Easy to Use',
                desc: 'No technical skills required. Upload → extract → download. Simple as that.',
              },
              {
                icon: <FileSpreadsheet className="h-8 w-8 text-brand-600" />,
                title: 'Real Excel Files',
                desc: 'Download actual .xlsx files with proper formatting and column types.',
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-brand-600" />,
                title: 'Review & Edit',
                desc: 'Preview and edit extracted data before exporting to verify accuracy.',
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-brand-600" />,
                title: 'Conversion History',
                desc: 'Access your recent conversions and track your document processing history.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Simple Pricing
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['5 conversions/month', 'Basic extraction', 'PDF & images'],
              },
              {
                name: 'Professional',
                price: '$5',
                popular: true,
                features: [
                  'Unlimited conversions',
                  'AI data cleaning',
                  'Advanced extraction',
                  'Conversion history',
                  'Priority support',
                ],
              },
              {
                name: 'Business',
                price: '$15',
                features: [
                  'Everything in Pro',
                  'Bulk processing',
                  'Advanced features',
                  'Webhook integration',
                  'Dedicated support',
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-8 ${
                  plan.popular
                    ? 'bg-brand-600 text-white shadow-xl transform scale-105'
                    : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="text-sm font-semibold bg-brand-700 px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-2xl font-bold my-4">{plan.name}</h3>
                <p className="text-4xl font-bold mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onStartClick}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-white text-brand-600 hover:bg-gray-100'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'What file formats do you support?',
                a: 'We support PDF, JPG, JPEG, and PNG files up to 10 MB each. Documents can contain tables, text, invoices, receipts, and more.',
              },
              {
                q: 'How accurate is the AI extraction?',
                a: 'Our AI extraction is highly accurate for well-formatted documents. We provide confidence levels and let you review all data before exporting.',
              },
              {
                q: 'Is my data secure?',
                a: 'Yes. Files are processed temporarily and automatically deleted after export. We do not store your documents or data.',
              },
              {
                q: 'Can I edit the extracted data?',
                a: 'Absolutely! You can edit, add, or remove rows and rename columns before downloading your Excel file.',
              },
              {
                q: 'What do I get with the free plan?',
                a: 'The free plan includes 5 conversions per month with basic extraction capabilities.',
              },
              {
                q: 'Can I export to other formats?',
                a: 'Currently we support Excel (.xlsx). Additional formats may be added in the future.',
              },
            ].map((item, idx) => (
              <details key={idx} className="bg-white rounded-lg p-6 cursor-pointer">
                <summary className="font-semibold text-gray-900 text-lg">
                  {item.q}
                </summary>
                <p className="text-gray-600 mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-brand-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Clean Your Data?
          </h2>
          <p className="text-xl text-brand-100 mb-8">
            Join thousands of professionals who save hours every week with Easy to Excel Clear.
          </p>
          <button
            onClick={onStartClick}
            className="bg-white text-brand-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Start Converting Now
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
