import React, { useEffect } from "react";
import { motion } from "framer-motion";

const Cancellation = () => {
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
            Cancellation & Refund Policy
          </h1>
          {/* <p className="text-gray-600 text-center mb-12 italic">
            Effective Date: {new Date().toLocaleDateString()}
          </p> */}

          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                1. Standard Cancellation Policy
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We understand that plans can change. Our cancellation policy is
                designed to be fair to both our guests and the hotel.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 font-serif text-primary">
                        Time of Cancellation
                      </th>
                      <th className="p-4 font-serif text-primary">
                        Refund Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-100">
                      <td className="p-4">
                        48 hours or more prior to check-in
                      </td>
                      <td className="p-4">100% Refund</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4">24 to 48 hours prior to check-in</td>
                      <td className="p-4">50% Refund</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4">
                        Less than 24 hours prior to check-in
                      </td>
                      <td className="p-4">No Refund</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                2. No-Show Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you do not check in on your scheduled arrival date, it will
                be considered a "No-Show". The entire booking amount will be
                forfeited, and no refund will be issued.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                3. Refund Process
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Refunds will be processed within 7-10 working days from the date
                of cancellation. The amount will be credited back to the
                original mode of payment used during booking.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                4. Peak Season Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                During peak seasons (e.g., New Year, Holi, Special Festivals),
                cancellation policies may vary. Bookings made for these periods
                may be non-refundable. Please check the specific terms mentioned
                during your booking confirmation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-primary mb-4">
                5. Modifications
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Modifications to bookings (e.g., change of dates) are subject to
                availability and current room rates. Charges may apply for date
                changes requested less than 48 hours before check-in.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cancellation;
