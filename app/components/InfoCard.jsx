
import react from 'react'



const InfoCard = (fileds=[], { data }) => {
    return (
        <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-gray-50 p-8 shadow-sm">
            <h2 className="mb-4 text-center text-lg font-semibold text-black">
                User Information
            </h2>
            <div className="space-y-2">
                {
                fileds.map((field) => (
                    <div key={field.id} className="flex justify-between">
                        <span className="font-medium text-gray-700">{field.label}:</span>
                        <span className="text-gray-900">{data[field.name]}</span>
                    </div>
                ))
                }
            </div>
        </div>
    );
};

export default InfoCard;    