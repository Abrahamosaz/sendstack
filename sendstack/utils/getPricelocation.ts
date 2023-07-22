import { notFound } from "next/navigation";

export type priceInfo = {
    status: string,
    message: string,
    data: {
        price: number
    }
}
export type functionType = (url: string, pickupcode: string, dropoffcode: string, pickupdate: string) => Promise<priceInfo>;

const getPricelocation: functionType = async (url: string, pickupcode: string, dropoffcode: string, pickupdate: string): Promise<priceInfo> => {

  try {
    const res = await fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json", app_id: "0273264", app_secret: 'CV5KFQ1ND243N66SPCCXD3W633V27K5K'},
        cache: 'no-store',
        body: JSON.stringify({
            "pickupCode": pickupcode,
            "dropoffCode": dropoffcode,
            "pickupDate": pickupdate
        })
    });
    const data = await res.json();
    return data;
} catch (err) {
    notFound();

}}

export default getPricelocation;