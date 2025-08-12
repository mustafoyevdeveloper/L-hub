import { SupportTicket } from '../models.js'

export async function createTicket(req, res) {
  try {
    const { subject, message } = req.body
    
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' })
    }

    const ticket = await SupportTicket.create({
      userId: req.user._id,
      subject,
      message,
      status: 'OPEN'
    })

    res.json(ticket)
  } catch (error) {
    console.error('Create ticket error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getTickets(req, res) {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}
    
    if (req.user.role === 'ADMIN') {
      // Admin can see all tickets
      const tickets = await SupportTicket.find(filter)
        .populate('userId', 'fullName email')
        .sort({ createdAt: -1 })
        .lean()
      res.json(tickets)
    } else {
      // Users can only see their own tickets
      const tickets = await SupportTicket.find({ ...filter, userId: req.user._id })
        .sort({ createdAt: -1 })
        .lean()
      res.json(tickets)
    }
  } catch (error) {
    console.error('Get tickets error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateTicketStatus(req, res) {
  try {
    const { id } = req.params
    const { status, adminNote } = req.body
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }

    const ticket = await SupportTicket.findById(id)
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    ticket.status = status
    if (adminNote) {
      ticket.adminNote = adminNote
    }
    
    await ticket.save()
    res.json(ticket)
  } catch (error) {
    console.error('Update ticket error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


