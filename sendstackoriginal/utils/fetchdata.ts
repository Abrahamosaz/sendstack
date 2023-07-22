import { notFound } from 'next/navigation';

export type localsObjects = {
    name: string,
    locationCode: string,
    isAvailable: boolean,
    id?: number
}

export type dataObjects = {
    state: string,
    locals: localsObjects[]

}

const getLocations: (url: string) => Promise<dataObjects> = async (url: string) => {
  try {
    const res = await fetch(url, {
        cache: 'no-store',
        headers: { app_id: "0273264", app_secret: 'CV5KFQ1ND243N66SPCCXD3W633V27K5K'}
    });
    const data = await res.json();
    return data.data;
} catch (err) {
    notFound();
}};

export default getLocations;