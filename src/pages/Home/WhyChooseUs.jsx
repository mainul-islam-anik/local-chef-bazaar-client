const features = [
  { icon: "🏠", title: "Home Cooked", desc: "Every meal prepared fresh at home by verified chefs" },
  { icon: "🚀", title: "Fast Delivery", desc: "Hot meals delivered within 30–45 minutes" },
  { icon: "💰", title: "Affordable Price", desc: "Quality homemade food at restaurant-beating prices" },
  { icon: "⭐", title: "Trusted Chefs", desc: "All chefs are verified and highly rated by customers" },
];

const WhyChooseUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Why Choose LocalChefBazaar?
      </h2>
      <p className="text-center text-gray-500 mb-10">
        The best platform for homemade food in your city
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;