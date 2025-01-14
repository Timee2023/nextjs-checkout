import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminProduct } from '../../../../lib/products';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = req.body;
    try {
        const productId = body.id;
        const product = await getAdminProduct(productId);
        if (!product) {
            return res.status(200).json({});
        }

        res.status(200).json(product);
    } catch (ex) {
        console.log('err', ex);
    }
}
