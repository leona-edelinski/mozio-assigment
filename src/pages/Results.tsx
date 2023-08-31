import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { calculateDistanceFromPoints } from "../utils/api";

type PointType = {
  distances: [
    {
      from: string;
      to: string;
      distance: number;
    }
  ];
  date: string;
  passengers: number;
};

const Results = (): JSX.Element => {
  const location = useLocation();
  const [resultForm, setResultForm] = useState<PointType>({
    distances: [
      {
        from: "",
        to: "",
        distance: 0,
      },
    ],
    date: "",
    passengers: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatServiceResponse = (response: any) => {
    return response.routes[0].segments.map((segment: any, index: number) => {
      return { [`distance${index}`]: segment.distance };
    });
  };

  const generateFormFromQuery = (query: string) => {
    const params = new URLSearchParams(query);

    const queryObject: any = {};
    const entriesArray = Array.from(params.entries());
    for (const [key, value] of entriesArray) {
      let parsedValue = value;
      try {
        parsedValue = JSON.parse(value);
      } catch (error) {}
      queryObject[key] = parsedValue;
    }

    return queryObject;
  };

  const calculateDistance = async (e: any) => {
    const points = formatDistancePayload(e);
    const response = await calculateDistanceFromPoints(points);
    return formatServiceResponse(response);
  };

  const formatDistancePayload = (e: any) => {
    const startLocaion = [e.origin.lon, e.origin.lat];
    const locationsData = e.destination.map((location: any) => [
      location.lon,
      location.lat,
    ]);
    locationsData.unshift(startLocaion);
    return locationsData;
  };

  const formatTripResults = (trip: any, distances: any) => {
    const tripDistances = distances.map((distanceObj: any, index: number) => {
      const fromCity = index === 0 ? trip.origin : trip.destination[index - 1];
      const toCity = trip.destination[index];
      const distanceKey = `distance${index}`;
      const distance = distanceObj[distanceKey];

      return {
        from: fromCity.name,
        to: toCity.name,
        distance: distance,
      };
    });
    return {
      passengers: trip.passengers,
      date: trip.date,
      distances: tripDistances,
    };
  };

  useEffect(() => {
    if (location.search) {
      setIsLoading(true);
      const queryObject = generateFormFromQuery(location.search);
      const calculateTripData = async () => {
        const distances = await calculateDistance(queryObject);
        const trip = formatTripResults(queryObject, distances);
        setResultForm(trip);
        setIsLoading(false);
      };
      calculateTripData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div>
      <div className="mb-4 bg-blue-300 flex flex-col justify-center rounded text-white my-10 w-2/4 p-6 text-2xl m-auto text-left">
        {isLoading ? (
          <div className="flex justify-center">Calculating trip...</div>
        ) : (
          <>
            {resultForm &&
              resultForm.distances.length > 0 &&
              resultForm.distances.map((result, index: number) => {
                return (
                  <div key={index}>
                    Traveling from <b>{result.from}</b> to <b>{result.to}</b>,
                    distance:{" "}
                    <b>
                      {(result.distance / 1000).toFixed(2)}
                      km
                    </b>
                  </div>
                );
              })}

            <div className="mt-6">
              Number of passengers: <b>{resultForm.passengers}</b>
            </div>
            <div>
              Date: <b>{resultForm.date}</b>
            </div>

            <div className="italic text-3xl self-center mt-16">Bon voyage!</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
