import React, { useEffect } from "react";
import { motion } from "framer-motion";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-8 text-center">
            Privacy Policy
          </h1>
          {/* <p className="text-gray-600 text-center mb-12 italic">
            Last updated: {new Date().toLocaleDateString()}
          </p> */}

          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-10">
            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to Shiv Ganga Hotel. We respect your privacy and are
                committed to protecting your personal data. This privacy policy
                will inform you as to how we look after your personal data when
                you visit our website or stay with us and tell you about your
                privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                2. Data We Collect
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may collect, use, store and transfer different kinds of
                personal data about you which we have grouped together follows:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Identity Data:</strong> includes first name, last
                  name, username or similar identifier, title, date of birth and
                  gender.
                </li>
                <li>
                  <strong>Contact Data:</strong> includes billing address, email
                  address and telephone numbers.
                </li>
                <li>
                  <strong>Financial Data:</strong> includes bank account and
                  payment card details.
                </li>
                <li>
                  <strong>Transaction Data:</strong> includes details about
                  payments to and from you and other details of products and
                  services you have purchased from us.
                </li>
                <li>
                  <strong>Technical Data:</strong> includes internet protocol
                  address, browser type and version, time zone setting, browser
                  plug-in types and versions, operating system and platform, and
                  other technology on the devices you use.
                </li>
                <li>
                  <strong>Usage Data:</strong> includes information about how
                  you use our website, products and services.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                3. How We Use Your Data
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We will only use your personal data when the law allows us to.
                Most commonly, we will use your personal data in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                <li>
                  Where we need to perform the contract we are about to enter
                  into or have entered into with you (e.g., your hotel booking).
                </li>
                <li>
                  Where it is necessary for our legitimate interests (or those
                  of a third party) and your interests and fundamental rights do
                  not override those interests.
                </li>
                <li>
                  Where we need to comply with a legal or regulatory obligation.
                </li>
                <li>
                  Where you have given consent, for example to receive marketing
                  communications.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                4. Cookies & Analytics
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your browsing
                experience, analyze traffic, and understand usage. You can
                control cookies through your browser settings. Disabling cookies
                may impact certain features.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Essential cookies:</strong> required for core
                  functionality such as session management.
                </li>
                <li>
                  <strong>Analytics cookies:</strong> help us measure and
                  improve performance and user experience.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                5. Data Sharing
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may share your data with trusted service providers to deliver
                our services, such as payment gateways, email providers, and
                booking platforms. These parties are required to respect the
                security of your data and treat it in accordance with the law.
                We may also share data to comply with legal obligations or
                requests from government authorities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                6. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We have put in place appropriate security measures to prevent
                your personal data from being accidentally lost, used or
                accessed in an unauthorized way, altered or disclosed. In
                addition, we limit access to your personal data to those
                employees, agents, contractors and other third parties who have
                a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We will only retain your personal data for as long as necessary
                to fulfill the purposes we collected it for, including for the
                purposes of satisfying any legal, accounting, or reporting
                requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                8. Your Rights
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Subject to applicable law, you may have the right to request:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access to your personal data.</li>
                <li>Correction of inaccurate or incomplete data.</li>
                <li>Deletion of your personal data.</li>
                <li>Restriction or objection to processing.</li>
                <li>Data portability.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                You can also withdraw consent where processing is based on
                consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                9. Children’s Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not directed to children under the age of 13.
                We do not knowingly collect personal data from children. If you
                believe a child has provided us with personal data, please
                contact us to delete the information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                10. International Transfers
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Some of our service providers may be located outside your
                country. Where data is transferred internationally, we ensure
                appropriate safeguards are in place consistent with applicable
                laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                11. Changes to This Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this policy from time to time to reflect changes
                to our practices or for legal reasons. The updated version will
                be posted on this page with a revised date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this privacy policy or our
                privacy practices, please contact us at:
              </p>
              <div className="mt-4 bg-gray-50 p-6 rounded-lg">
                <p className="text-primary font-bold">Shiv Ganga Hotel</p>
                <p className="text-gray-600">
                  Badrinath Road, Gughtyani Talli, Tapovan
                </p>
                <p className="text-gray-600">
                  Rishikesh, Uttarakhand, India 249192
                </p>
                <p className="text-gray-600 mt-2">
                  Email: hotelshivganga.rishikesh@gmail.com
                </p>
                <p className="text-gray-600">Phone: +91-9837368384</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
