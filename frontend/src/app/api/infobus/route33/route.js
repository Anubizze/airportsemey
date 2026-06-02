export async function GET() {
  try {
    const [routesResponse, busesResponse, stationsResponse] = await Promise.all([
      fetch('https://infobus.kz/cities/6/routes?lang=ru', { cache: 'no-store' }),
      fetch('https://infobus.kz/cities/6/routes/120/busses', { cache: 'no-store' }),
      fetch('https://infobus.kz/cities/6/routes/120/stations?lang=ru', { cache: 'no-store' }),
    ]);

    if (!routesResponse.ok || !busesResponse.ok || !stationsResponse.ok) {
      return Response.json(
        { error: 'INFOBUS_UNAVAILABLE' },
        { status: 502 },
      );
    }

    const [routes, buses, stations] = await Promise.all([
      routesResponse.json(),
      busesResponse.json(),
      stationsResponse.json(),
    ]);

    const route =
      Array.isArray(routes)
        ? routes.find((item) => String(item.routeNumber).trim() === '33')
        : null;

    return Response.json({
      route,
      buses: Array.isArray(buses) ? buses : [],
      stations: Array.isArray(stations) ? stations : [],
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      { error: 'INFOBUS_REQUEST_FAILED' },
      { status: 502 },
    );
  }
}
