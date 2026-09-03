import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/assets";

function AssetDetails() {
  const { assetId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/${assetId}/details`);

        if (!response.ok) {
          throw new Error("Failed to fetch asset details");
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [assetId]);

  if (loading) {
    return <p style={{ padding: "24px" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ padding: "24px" }}>{error}</p>;
  }

  if (!data) {
    return <p style={{ padding: "24px" }}>Asset not found.</p>;
  }

  const { asset, risk, explanation } = data;

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>{asset.asset_id}</h1>

      <p>
        {asset.asset_type} — {asset.station_name}
      </p>

      <h2>AI Risk</h2>

      {risk ? (
        <div>
          <p>
            <strong>Risk Level:</strong> {risk.risk_level}
          </p>

          <p>
            <strong>Risk Score:</strong> {risk.risk_score.toFixed(2)}
          </p>

          <p>
            <strong>Predicted Probability:</strong>{" "}
            {(risk.predicted_probability * 100).toFixed(2)}%
          </p>

          <p>
            <strong>Recommended Action:</strong> {risk.recommended_action}
          </p>
        </div>
      ) : (
        <p>No ML risk data available.</p>
      )}

      {explanation && (
        <>
          <h2>Why is this asset at risk?</h2>

          <ul>
            {[
              explanation.top_reason_1,
              explanation.top_reason_2,
              explanation.top_reason_3,
              explanation.top_reason_4,
              explanation.top_reason_5,
            ]
              .filter(Boolean)
              .map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
          </ul>

          <h3>Protective Factors</h3>

          <ul>
            {[
              explanation.protective_factor_1,
              explanation.protective_factor_2,
              explanation.protective_factor_3,
            ]
              .filter(Boolean)
              .map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default AssetDetails;
