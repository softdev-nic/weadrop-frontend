import React from "react";

 
const Card = ({ classes = [], data = {}, children }) => {
  const { title, description, image, imageAlt = "", fields = [] } = data ?? {};

  return (
    <div
      className={[
        "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm",
        ...classes,
      ].join(" ")}
    >
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={imageAlt} className="h-48 w-full object-cover" />
      )}

      <div className="space-y-4 p-6">
        {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
        {description && <p className="text-sm text-gray-600">{description}</p>}

        {fields.length > 0 && (
          <dl className="space-y-2 text-sm">
            {fields.map((field) => (
              <div key={field.label} className="flex justify-between gap-4">
                <dt className="font-medium text-gray-700">{field.label}</dt>
                <dd className="text-right text-gray-900">{field.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {children}
      </div>
    </div>
  );
};

export default Card;
