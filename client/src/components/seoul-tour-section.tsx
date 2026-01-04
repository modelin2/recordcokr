export default function SeoulTourSection() {
  return (
    <section id="tours" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6 lg:px-8 xl:px-12 max-w-7xl">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">🗺️ Seoul Walking Guide</h2>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Walk from Recording Cafe to Hangang River Park
        </p>
        
        {/* YouTube Shorts - Walking to Han River */}
        <div className="max-w-sm mx-auto">
          <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/FzBqrwM5nvk"
              title="Walking from Recording Cafe to Hangang River Park"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-center text-gray-400 text-sm mt-3">🌊 10 min walk to Hangang River Park</p>
        </div>
      </div>
    </section>
  );
}