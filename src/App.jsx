import bgBooking from "./assets/images/bg-booking.jpg";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-white relative"
      style={{ backgroundImage: `url(${bgBooking})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>

      <div className="relative z-10">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
