import Fees from '../models/fees.js';

class FeesController {
  static async getAllFees(req, res) {
    try {
      const fees = await Fees.findAll();
      return res.json(fees);
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  }
}

export default FeesController; 