import React from "react";

interface AggregationCardProps {
  title: string;
  value: number;
  description: string;
  color: string;
}

const AggregationCard: React.FC<AggregationCardProps> = ({
  title,
  value,
  description,
  color,
}) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition-all`}
      style={{ backgroundColor: color, color: "white" }}
    >
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-2xl font-semibold mb-2">{value}</p>
      <p className="text-sm text-white">{description}</p>
    </div>
  );
};

export default AggregationCard;
