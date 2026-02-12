import React, { useEffect } from "react";
import { motion } from "framer-motion";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-8 text-center">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-center mb-12 italic">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using the Shiv Ganga Hotel website and booking
                services, you accept and agree to be bound by the terms and
                provision of this agreement. In addition, when using these
                particular services, you shall be subject to any posted
                guidelines or rules applicable to such services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                2. Booking & Reservations
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  All bookings are subject to availability and confirmation by
                  the hotel.
                </li>
                <li>
                  A valid government-issued ID proof (Aadhar Card, Driving
                  License, Voter ID, or Passport) is mandatory for all guests
                  upon check-in. PAN Card is not accepted as a valid ID proof.
                </li>
                <li>
                  The primary guest must be at least 18 years of age to check
                  into the hotel.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                3. Check-In & Check-Out
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Check-in time:</strong> 12:00 PM
                </li>
                <li>
                  <strong>Check-out time:</strong> 11:00 AM
                </li>
                <li>
                  Early check-in and late check-out are subject to availability
                  and may incur additional charges.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                4. Hotel Rules
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Smoking is strictly prohibited in non-smoking rooms and public
                  areas.
                </li>
                <li>
                  Guests are responsible for any damage caused to hotel property
                  during their stay.
                </li>
                <li>
                  Illegal activities, gambling, and possession of prohibited
                  substances are strictly forbidden within the hotel premises.
                </li>
                <li>
                  Visitors are not allowed in guest rooms after 10:00 PM. They
                  must meet in the lobby or public areas.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                5. Payment
              </h2>
              <p className="text-gray-600 leading-relaxed">
                All bills must be settled in full upon presentation. We accept
                cash, credit/debit cards, and UPI payments. Advance payment may
                be required to confirm your reservation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                The hotel shall not be liable for any loss or damage to guest
                property unless deposited in the hotel safe. We reserve the
                right to admission.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
