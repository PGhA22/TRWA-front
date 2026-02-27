import { useNavigate } from "react-router";
import "../style.css";
import "./comingSoonStyle.css";

export default function ComingSoon() {
  const navigate = useNavigate();
  return (
    <>
      <div className="coming-container">
      <div className="coming-card">
        <h2>Coming Soon</h2>
        <p>Something powerful is being built for TRW.</p>

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>
      </div>
    </div>
    </>
  );
}
