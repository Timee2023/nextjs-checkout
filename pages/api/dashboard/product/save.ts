import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]';
import { updateProduct } from '../../../../lib/products';
import { removeCurrency } from '../../../../lib/helpers';
import { validateSchema } from '../../../../lib/helpers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }

    // Check session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(404).send({
            content:
                "This is protected content. You can't access this content because you are signed in.",
        });
        return;
    }

    const body = req.body;
    // Fix values
    body.price = removeCurrency(body.price);
    delete body.images;

    // Validate product
    const schemaCheck = validateSchema('saveProduct', body);
    if (schemaCheck === false) {
        return res.status(400).json({
            error: 'Please check inputs',
        });
    }

    const productId = body.id;
    try {
        const payload = Object.assign({}, body);
        delete payload.id;
        await updateProduct(productId, payload);
        res.status(200).json(body);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Cannot save product',
        });
    }
}
