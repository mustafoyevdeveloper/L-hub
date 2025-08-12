import { KYCDocument, KYCVerification, User, AuditLog } from '../models.js'
import { upload } from '../middleware/upload.js'

export async function uploadDocument(req, res) {
  try {
    const { type, documentNumber } = req.body
    if (!type || !documentNumber || !req.file) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const doc = await KYCDocument.create({
      userId: req.user._id,
      type,
      documentNumber,
      documentUrl: `/uploads/${req.file.filename}`,
      status: 'PENDING'
    })

    await AuditLog.create({
      userId: req.user._id,
      action: 'KYC_DOCUMENT_UPLOAD',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: { documentType: type, documentId: doc._id }
    })

    res.json(doc)
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document' })
  }
}

export async function getKYCStatus(req, res) {
  try {
    const verification = await KYCVerification.findOne({ userId: req.user._id })
    const documents = await KYCDocument.find({ userId: req.user._id })
    
    res.json({
      verification: verification || { overallStatus: 'PENDING' },
      documents
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get KYC status' })
  }
}

export async function adminListKYC(req, res) {
  try {
    const { status } = req.query
    const where = status ? { overallStatus: status } : {}
    
    const verifications = await KYCVerification.find(where)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .lean()
    
    res.json(verifications)
  } catch (error) {
    res.status(500).json({ error: 'Failed to list KYC requests' })
  }
}

export async function adminVerifyKYC(req, res) {
  try {
    const { userId } = req.params
    const { faceVerified, addressVerified, documentsVerified, pepCheck, sanctionsCheck, notes } = req.body
    
    let verification = await KYCVerification.findOne({ userId })
    if (!verification) {
      verification = new KYCVerification({ userId })
    }
    
    verification.faceVerified = faceVerified
    verification.addressVerified = addressVerified
    verification.documentsVerified = documentsVerified
    verification.pepCheck = pepCheck
    verification.sanctionsCheck = sanctionsCheck
    verification.notes = notes
    
    if (faceVerified && addressVerified && documentsVerified && pepCheck && sanctionsCheck) {
      verification.overallStatus = 'VERIFIED'
      verification.verifiedAt = new Date()
      verification.verifiedBy = req.user._id
      
      await User.findByIdAndUpdate(userId, { kycStatus: 'VERIFIED' })
    } else {
      verification.overallStatus = 'PENDING'
    }
    
    await verification.save()
    
    await AuditLog.create({
      userId: req.user._id,
      action: 'ADMIN_ACTION',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: { action: 'KYC_VERIFICATION', targetUserId: userId, status: verification.overallStatus }
    })
    
    res.json(verification)
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify KYC' })
  }
}
