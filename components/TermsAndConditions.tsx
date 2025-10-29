import React from 'react';
import { ArrowLeftIcon } from './icons/Icons';

interface TermsAndConditionsProps {
    onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2 mb-4">{title}</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
            {children}
        </div>
    </section>
);

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack }) => {

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-6 hover:underline">
                <ArrowLeftIcon className="w-5 h-5"/>
                Back to Home
            </button>

            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100">Terms and Conditions</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Last updated: October 2025</p>
            </div>

            <Section title="1. Introduction">
                <p>
                    Welcome to RideLink ("we", "us", "our"). These Terms and Conditions govern your use of our website, mobile application, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these terms.
                </p>
            </Section>

             <Section title="2. Registration and Verification">
                <p>
                    To use our Services, you must create an account. You agree to provide accurate, current, and complete information during registration. We require identity verification through Aadhaar or LinkedIn to enhance safety and trust within our community. You are responsible for safeguarding your account password.
                </p>
            </Section>

            <Section title="3. Use of Services">
                <p><strong>For Drivers:</strong> By publishing a ride, you confirm that you hold a valid driving license, your vehicle is insured and in good roadworthy condition, and you are legally permitted to drive. You agree not to offer rides for commercial profit but only to share costs.</p>
                <p><strong>For Passengers:</strong> You agree to respect the driver's vehicle and rules, be punctual at the agreed pickup location, and pay the agreed-upon amount for the journey.</p>
            </Section>

            <Section title="4. Financial Conditions">
                <p>
                    Drivers set the price for their ride, intended to cover their fuel and vehicle running costs. RideLink charges a service fee on each booking, which is clearly displayed to the passenger before payment. All payments are processed through our secure third-party payment gateways like Razorpay or Stripe.
                </p>
            </Section>

            <Section title="5. Cancellation Policy">
                <p>
                    Passengers can cancel a booking according to our Cancellation Policy. A full refund (excluding the service fee) is typically provided if the cancellation occurs more than 24 hours before the scheduled departure. Drivers are also expected to honor their published rides and may face penalties for frequent cancellations.
                </p>
            </Section>

            <Section title="6. User Conduct and Content">
                <p>
                    You agree to use our Services responsibly and respectfully. You will not post any content that is unlawful, defamatory, or infringes on others' rights. The review system is intended to provide genuine feedback; any misuse, such as posting fake reviews, is strictly prohibited.
                </p>
            </Section>

             <Section title="7. Limitation of Liability">
                <p>
                    RideLink is a platform that connects drivers and passengers. We are not a transport provider and do not own or operate any vehicles. We are not liable for any incidents that may occur during a ride, including accidents, delays, or disagreements between members. However, we strive to maintain a safe community through features like verification and our AI Trust Score.
                </p>
            </Section>
            
            <Section title="8. Termination">
                <p>
                    We reserve the right to suspend or terminate your account at our discretion if you violate these Terms and Conditions or engage in any behavior that we deem harmful to the RideLink community.
                </p>
            </Section>
        </div>
    );
};

export default TermsAndConditions;
