import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Plus, ExternalLink, Calendar, DollarSign, Users, Mic, 
  MapPin, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronRight, 
  Trash2, RefreshCw, Download, Video, UserCheck, Newspaper, Heart
} from 'lucide-react'

// Status Badge Component
const StatusBadge = ({ status, type = 'default' }) => {
  const configs = {
    high: { bg: 'bg-red-100', color: 'text-red-800', label: 'High Priority' },
    medium: { bg: 'bg-amber-100', color: 'text-amber-800', label: 'Medium' },
    low: { bg: 'bg-blue-100', color: 'text-blue-800', label: 'Low' },
    pending: { bg: 'bg-amber-100', color: 'text-amber-800', label: 'Pending' },
    completed: { bg: 'bg-green-100', color: 'text-green-800', label: 'Done' },
    in_progress: { bg: 'bg-blue-100', color: 'text-blue-800', label: 'In Progress' },
    prospect: { bg: 'bg-gray-100', color: 'text-gray-700', label: 'Prospect' },
    outreach: { bg: 'bg-blue-100', color: 'text-blue-800', label: 'Outreach' },
    pitched: { bg: 'bg-blue-100', color: 'text-blue-800', label: 'Pitched' },
    active: { bg: 'bg-green-100', color: 'text-green-800', label: 'Active' },
    researching: { bg: 'bg-amber-100', color: 'text-amber-800', label: 'Researching' },
    pipeline: { bg: 'bg-gray-100', color: 'text-gray-700', label: 'Pipeline' },
    applying: { bg: 'bg-blue-100', color: 'text-blue-800', label: 'Applying' },
    submitted: { bg: 'bg-green-100', color: 'text-green-800', label: 'Submitted' },
    considering: { bg: 'bg-gray-100', color: 'text-gray-700', label: 'Considering' },
    registered: { bg: 'bg-green-100', color: 'text-green-800', label: 'Registered' },
    attending: { bg: 'bg-blue-100', color: 'text-blue-800', label: 'Attending' },
    scheduled: { bg: 'bg-green-100', color: 'text-green-800', label: 'Scheduled' },
    // Content statuses
    ideation: { bg: 'bg-gray-100', color: 'text-gray-700', label: 'Ideation' },
    pre_production: { bg: 'bg-amber-100', color: 'text-amber-800', label: 'Pre-Prod' },
    production: { bg: 'bg-blue-100', color: 'text-blue-800', label: 'Production' },
    post_production: { bg: 'bg-purple-100', color: 'text-purple-800', label: 'Post-Prod' },
    review: { bg: 'bg-amber-100', color: 'text-amber-800', label: 'Review' },
    published: { bg: 'bg-green-100', color: 'text-green-800', label: 'Published' },
    // Expert availability
    available: { bg: 'bg-green-100', color: 'text-green-800', label: 'Available' },
    busy: { bg: 'bg-amber-100', color: 'text-amber-800', label: 'Busy' },
    unavailable: { bg: 'bg-red-100', color: 'text-red-800', label: 'Unavailable' },
    unknown: { bg: 'bg-gray-100', color: 'text-gray-700', label: 'Unknown' },
    // Press statuses
    interested: { bg: 'bg-amber-100', color: 'text-amber-800', label: 'Interested' },
    confirmed: { bg: 'bg-green-100', color: 'text-green-800', label: 'Confirmed' },
    declined: { bg: 'bg-red-100', color: 'text-red-800', label: 'Declined' },
    // Donor statuses
    cultivating: { bg: 'bg-amber-100', color: 'text-amber-800', label: 'Cultivating' },
    asked: { bg: 'bg-blue-100', color: 'text-blue-800', label: 'Asked' },
    committed: { bg: 'bg-green-100', color: 'text-green-800', label: 'Committed' },
    received: { bg: 'bg-green-100', color: 'text-green-800', label: 'Received' },
    lapsed: { bg: 'bg-gray-100', color: 'text-gray-700', label: 'Lapsed' },
  }
  const config = configs[status] || configs.low
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${config.bg} ${config.color}`}>
      {config.label}
    </span>
  )
}

// Section Header Component
const SectionHeader = ({ icon: Icon, title, count, onAdd, collapsed, onToggle }) => (
  <div 
    onClick={onToggle}
    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3 cursor-pointer select-none hover:bg-gray-100 transition-colors"
  >
    <div className="flex items-center gap-2.5">
      {collapsed ? <ChevronRight size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
      <Icon size={20} className="text-genius-red" />
      <span className="font-semibold text-gray-900">{title}</span>
      <span className="bg-genius-red text-white px-2 py-0.5 rounded-full text-xs font-medium">{count}</span>
    </div>
    {onAdd && (
      <button
        onClick={(e) => { e.stopPropagation(); onAdd(); }}
        className="flex items-center gap-1 px-3 py-1.5 bg-genius-red text-white rounded-md text-sm font-medium hover:bg-genius-red-dark transition-colors"
      >
        <Plus size={14} /> Add
      </button>
    )}
  </div>
)

// Task Item Component
const TaskItem = ({ task, onUpdate, onDelete }) => {
  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed'
  
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border animate-fadeIn card-hover ${isOverdue ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
      <input
        type="checkbox"
        checked={task.status === 'completed'}
        onChange={() => onUpdate({ ...task, status: task.status === 'completed' ? 'pending' : 'completed' })}
        className="mt-1 cursor-pointer accent-genius-red w-4 h-4"
      />
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          {task.title}
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            Due: {new Date(task.due_date).toLocaleDateString()}
          </span>
          <StatusBadge status={task.priority} />
          {task.notes && <span className="text-xs text-gray-500 truncate">{task.notes}</span>}
        </div>
      </div>
      <button onClick={() => onDelete(task.id)} className="p-1 hover:bg-gray-100 rounded">
        <Trash2 size={14} className="text-gray-400" />
      </button>
    </div>
  )
}

// Grant Item Component
const GrantItem = ({ grant, onUpdate }) => {
  const deadline = grant.deadline
  const isRolling = deadline === 'Rolling'
  const deadlineDate = isRolling ? null : new Date(deadline)
  const daysUntil = deadlineDate ? Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24)) : null
  const isUrgent = daysUntil !== null && daysUntil <= 30 && daysUntil > 0
  const isPast = daysUntil !== null && daysUntil < 0

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-2 animate-fadeIn card-hover">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm text-gray-900">{grant.title}</span>
            <StatusBadge status={grant.fit} />
          </div>
          <div className="text-sm text-gray-500 mb-1">{grant.funder}</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="text-green-600 font-medium">{grant.amount}</span>
            <span className={`${isPast ? 'text-red-600' : isUrgent ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
              {isRolling ? 'Rolling deadline' : isPast ? 'Deadline passed' : `Due: ${deadlineDate.toLocaleDateString()} (${daysUntil} days)`}
            </span>
          </div>
          {grant.requirements && <div className="text-xs text-gray-500 mt-1">{grant.requirements}</div>}
        </div>
        <div className="flex flex-col gap-1 items-end">
          <select
            value={grant.status}
            onChange={(e) => onUpdate({ ...grant, status: e.target.value })}
            className="px-2 py-1 text-xs border border-gray-200 rounded bg-white cursor-pointer"
          >
            <option value="pipeline">Pipeline</option>
            <option value="researching">Researching</option>
            <option value="applying">Applying</option>
            <option value="submitted">Submitted</option>
          </select>
          {grant.link && (
            <a href={grant.link} target="_blank" rel="noopener noreferrer" className="text-genius-red hover:text-genius-red-dark">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// Partner Item Component
const PartnerItem = ({ partner, onUpdate }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 mb-2 animate-fadeIn card-hover">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-sm text-gray-900">{partner.name}</span>
          <StatusBadge status={partner.fit} />
        </div>
        <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
          <MapPin size={12} /> {partner.location}
        </div>
        <div className="text-xs text-gray-600 mb-1">{partner.description}</div>
        {partner.contact && <div className="text-xs text-genius-red font-medium">{partner.contact}</div>}
        {partner.service_needs?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {partner.service_needs.map((need, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{need}</span>
            ))}
          </div>
        )}
      </div>
      <select
        value={partner.status}
        onChange={(e) => onUpdate({ ...partner, status: e.target.value })}
        className="px-2 py-1 text-xs border border-gray-200 rounded bg-white cursor-pointer"
      >
        <option value="prospect">Prospect</option>
        <option value="outreach">Outreach</option>
        <option value="active">Active Partner</option>
      </select>
    </div>
  </div>
)

// Media Item Component
const MediaItem = ({ media, onUpdate }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 mb-2 animate-fadeIn card-hover">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-sm text-gray-900">{media.name}</span>
          <StatusBadge status={media.fit} />
        </div>
        <div className="text-sm text-gray-500 mb-1">Host: {media.host} • {media.platform}</div>
        <div className="text-xs text-gray-600">{media.notes}</div>
      </div>
      <select
        value={media.status}
        onChange={(e) => onUpdate({ ...media, status: e.target.value })}
        className="px-2 py-1 text-xs border border-gray-200 rounded bg-white cursor-pointer"
      >
        <option value="prospect">Prospect</option>
        <option value="pitched">Pitched</option>
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  </div>
)

// Event Item Component
const EventItem = ({ event, onUpdate }) => {
  const daysUntil = Math.ceil((new Date(event.start_date) - new Date()) / (1000 * 60 * 60 * 24))
  const isPast = daysUntil < 0

  return (
    <div className={`p-4 bg-white rounded-lg border border-gray-200 mb-2 animate-fadeIn card-hover ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm text-gray-900">{event.name}</span>
            <StatusBadge status={event.priority} />
          </div>
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
            <Calendar size={12} />
            {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
            {!isPast && <span className={`ml-2 ${daysUntil <= 30 ? 'text-amber-600' : 'text-gray-500'}`}>({daysUntil} days)</span>}
          </div>
          <div className="text-xs text-gray-600 flex items-center gap-1">
            <MapPin size={12} /> {event.location}
          </div>
          {event.notes && <div className="text-xs text-gray-500 mt-1">{event.notes}</div>}
        </div>
        <select
          value={event.status}
          onChange={(e) => onUpdate({ ...event, status: e.target.value })}
          className="px-2 py-1 text-xs border border-gray-200 rounded bg-white cursor-pointer"
        >
          <option value="considering">Considering</option>
          <option value="registered">Registered</option>
          <option value="attending">Attending</option>
        </select>
      </div>
    </div>
  )
}

// Policy Item Component
const PolicyItem = ({ policy }) => (
  <div className="p-4 bg-white rounded-lg border-l-4 border-l-genius-red border border-gray-200 mb-2 animate-fadeIn">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-sm text-gray-900">{policy.title}</span>
          <StatusBadge status={policy.priority} />
        </div>
        <div className="text-xs text-gray-500 mb-2">{new Date(policy.date).toLocaleDateString()}</div>
        <div className="text-sm text-gray-600 mb-2">{policy.description}</div>
        {policy.action_items?.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">ACTION ITEMS:</div>
            {policy.action_items.map((item, i) => (
              <div key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                <span className="text-genius-red">→</span> {item}
              </div>
            ))}
          </div>
        )}
      </div>
      {policy.link && (
        <a href={policy.link} target="_blank" rel="noopener noreferrer" className="text-genius-red hover:text-genius-red-dark">
          <ExternalLink size={16} />
        </a>
      )}
    </div>
  </div>
)

// Content Pipeline Item Component
const ContentItem = ({ content, onUpdate }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 mb-2 animate-fadeIn card-hover">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-sm text-gray-900">{content.title}</span>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-medium uppercase">{content.content_type}</span>
        </div>
        {content.partner_client && <div className="text-sm text-gray-500 mb-1">For: {content.partner_client}</div>}
        {content.description && <div className="text-xs text-gray-600 mb-1">{content.description}</div>}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {content.platform && <span>Platform: {content.platform}</span>}
          {content.due_date && <span>Due: {new Date(content.due_date).toLocaleDateString()}</span>}
        </div>
        {content.notes && <div className="text-xs text-amber-600 mt-1">{content.notes}</div>}
      </div>
      <select
        value={content.status}
        onChange={(e) => onUpdate({ ...content, status: e.target.value })}
        className="px-2 py-1 text-xs border border-gray-200 rounded bg-white cursor-pointer"
      >
        <option value="ideation">Ideation</option>
        <option value="pre_production">Pre-Production</option>
        <option value="production">Production</option>
        <option value="post_production">Post-Production</option>
        <option value="review">Review</option>
        <option value="published">Published</option>
      </select>
    </div>
  </div>
)

// Expert Item Component
const ExpertItem = ({ expert, onUpdate }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 mb-2 animate-fadeIn card-hover">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-sm text-gray-900">{expert.name}</span>
          <StatusBadge status={expert.availability} />
        </div>
        <div className="text-sm text-gray-500 mb-1">{expert.expertise}</div>
        {expert.organization && <div className="text-xs text-gray-600 mb-1">{expert.organization}</div>}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {expert.location && <span className="flex items-center gap-1"><MapPin size={10} />{expert.location}</span>}
          {expert.contact_email && <span className="text-genius-red">{expert.contact_email}</span>}
        </div>
        {expert.past_collaborations && <div className="text-xs text-gray-500 mt-1">Past work: {expert.past_collaborations}</div>}
        {expert.notes && <div className="text-xs text-gray-600 mt-1">{expert.notes}</div>}
      </div>
      <select
        value={expert.availability}
        onChange={(e) => onUpdate({ ...expert, availability: e.target.value })}
        className="px-2 py-1 text-xs border border-gray-200 rounded bg-white cursor-pointer"
      >
        <option value="available">Available</option>
        <option value="busy">Busy</option>
        <option value="unavailable">Unavailable</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>
  </div>
)

// Press Item Component
const PressItem = ({ press, onUpdate }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 mb-2 animate-fadeIn card-hover">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-sm text-gray-900">{press.outlet}</span>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium uppercase">{press.coverage_type}</span>
        </div>
        {press.contact_name && <div className="text-sm text-gray-500 mb-1">Contact: {press.contact_name}</div>}
        {press.topic && <div className="text-xs text-gray-600 mb-1">Topic: {press.topic}</div>}
        {press.contact_email && <div className="text-xs text-genius-red">{press.contact_email}</div>}
        {press.notes && <div className="text-xs text-gray-500 mt-1">{press.notes}</div>}
        {press.link && (
          <a href={press.link} target="_blank" rel="noopener noreferrer" className="text-xs text-genius-red hover:underline flex items-center gap-1 mt-1">
            <ExternalLink size={10} /> View Coverage
          </a>
        )}
      </div>
      <select
        value={press.status}
        onChange={(e) => onUpdate({ ...press, status: e.target.value })}
        className="px-2 py-1 text-xs border border-gray-200 rounded bg-white cursor-pointer"
      >
        <option value="prospect">Prospect</option>
        <option value="pitched">Pitched</option>
        <option value="interested">Interested</option>
        <option value="confirmed">Confirmed</option>
        <option value="published">Published</option>
        <option value="declined">Declined</option>
      </select>
    </div>
  </div>
)

// Donor Item Component
const DonorItem = ({ donor, onUpdate }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 mb-2 animate-fadeIn card-hover">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-sm text-gray-900">{donor.name}</span>
          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium uppercase">{donor.donor_type}</span>
        </div>
        {donor.contact_name && <div className="text-sm text-gray-500 mb-1">{donor.contact_name}</div>}
        <div className="flex flex-wrap gap-3 text-xs">
          {donor.amount_potential && <span className="text-green-600 font-medium">Potential: {donor.amount_potential}</span>}
          {donor.amount_given && <span className="text-gray-600">Given: {donor.amount_given}</span>}
        </div>
        {donor.last_contact && <div className="text-xs text-gray-500 mt-1">Last contact: {new Date(donor.last_contact).toLocaleDateString()}</div>}
        {donor.next_action && <div className="text-xs text-amber-600 mt-1">Next: {donor.next_action}</div>}
        {donor.notes && <div className="text-xs text-gray-500 mt-1">{donor.notes}</div>}
      </div>
      <select
        value={donor.status}
        onChange={(e) => onUpdate({ ...donor, status: e.target.value })}
        className="px-2 py-1 text-xs border border-gray-200 rounded bg-white cursor-pointer"
      >
        <option value="prospect">Prospect</option>
        <option value="cultivating">Cultivating</option>
        <option value="asked">Asked</option>
        <option value="committed">Committed</option>
        <option value="received">Received</option>
        <option value="declined">Declined</option>
        <option value="lapsed">Lapsed</option>
      </select>
    </div>
  </div>
)

// Add Task Modal
const AddTaskModal = ({ onClose, onAdd }) => {
  const [task, setTask] = useState({
    title: '',
    category: 'general',
    due_date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    status: 'pending',
    notes: ''
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Task</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500">✕</button>
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Task title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-genius-red/20 focus:border-genius-red"
          />
          <input
            type="date"
            value={task.due_date}
            onChange={(e) => setTask({ ...task, due_date: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-genius-red/20 focus:border-genius-red"
          />
          <select
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-genius-red/20 focus:border-genius-red"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select
            value={task.category}
            onChange={(e) => setTask({ ...task, category: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-genius-red/20 focus:border-genius-red"
          >
            <option value="grants">Grants</option>
            <option value="partners">Partners</option>
            <option value="media">Media</option>
            <option value="events">Events</option>
            <option value="content">Content</option>
            <option value="donors">Donors</option>
            <option value="press">Press</option>
            <option value="general">General</option>
          </select>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={task.notes}
            onChange={(e) => setTask({ ...task, notes: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-genius-red/20 focus:border-genius-red"
          />
          <button
            onClick={() => {
              if (task.title) {
                onAdd(task)
                onClose()
              }
            }}
            className="px-4 py-2.5 bg-genius-red text-white rounded-lg text-sm font-medium hover:bg-genius-red-dark transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function Dashboard() {
  const [data, setData] = useState({
    policy: [],
    grants: [],
    partners: [],
    media: [],
    events: [],
    tasks: [],
    content: [],
    experts: [],
    press: [],
    donors: []
  })
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState({})
  const [showAddTask, setShowAddTask] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    
    if (!supabase) {
      console.error('Supabase not configured')
      setLoading(false)
      return
    }
    
    try {
      const [policyRes, grantsRes, partnersRes, mediaRes, eventsRes, tasksRes, contentRes, expertsRes, pressRes, donorsRes, settingsRes] = await Promise.all([
        supabase.from('policy_updates').select('*').order('date', { ascending: false }),
        supabase.from('grants').select('*').order('deadline', { ascending: true }),
        supabase.from('partners').select('*').order('name'),
        supabase.from('media').select('*').order('name'),
        supabase.from('events').select('*').order('start_date'),
        supabase.from('tasks').select('*').order('due_date'),
        supabase.from('content_pipeline').select('*').order('created_at', { ascending: false }),
        supabase.from('experts').select('*').order('name'),
        supabase.from('press').select('*').order('created_at', { ascending: false }),
        supabase.from('donors').select('*').order('name'),
        supabase.from('settings').select('*').eq('key', 'last_updated').single()
      ])

      setData({
        policy: policyRes.data || [],
        grants: grantsRes.data || [],
        partners: partnersRes.data || [],
        media: mediaRes.data || [],
        events: eventsRes.data || [],
        tasks: tasksRes.data || [],
        content: contentRes.data || [],
        experts: expertsRes.data || [],
        press: pressRes.data || [],
        donors: donorsRes.data || []
      })
      
      if (settingsRes.data?.value?.timestamp) {
        setLastUpdated(new Date(settingsRes.data.value.timestamp))
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoading(false)
  }

  const updateItem = async (table, item) => {
    try {
      const { error } = await supabase.from(table).update(item).eq('id', item.id)
      if (!error) {
        const tableKey = table === 'content_pipeline' ? 'content' : table
        setData(prev => ({
          ...prev,
          [tableKey]: prev[tableKey].map(i => i.id === item.id ? item : i)
        }))
        await supabase.from('settings').upsert({ key: 'last_updated', value: { timestamp: new Date().toISOString() } })
      }
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const addTask = async (task) => {
    try {
      const { data: newTask, error } = await supabase.from('tasks').insert([task]).select().single()
      if (!error && newTask) {
        setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }))
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (!error) {
        setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }))
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const toggleCollapse = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `genius-recovery-dashboard-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw size={32} className="text-genius-red animate-spin mx-auto" />
          <p className="mt-3 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const pendingTasks = data.tasks.filter(t => t.status !== 'completed')
  const overdueTasks = pendingTasks.filter(t => new Date(t.due_date) < new Date())
  const upcomingGrants = data.grants.filter(g => {
    if (g.deadline === 'Rolling') return true
    const days = Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 60
  })
  const upcomingEvents = data.events.filter(e => {
    const days = Math.ceil((new Date(e.start_date) - new Date()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 90
  })
  const activeContent = data.content.filter(c => c.status !== 'published')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: CheckCircle },
    { id: 'content', label: 'Content', icon: Video },
    { id: 'grants', label: 'Grants', icon: DollarSign },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'donors', label: 'Donors', icon: Heart },
    { id: 'media', label: 'Media', icon: Mic },
    { id: 'press', label: 'Press', icon: Newspaper },
    { id: 'experts', label: 'Experts', icon: UserCheck },
    { id: 'events', label: 'Events', icon: Calendar }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-genius-red to-genius-red-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h1 className="text-2xl font-bold">Genius Recovery</h1>
              <p className="text-sm opacity-90">Executive Director Dashboard</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
              >
                <RefreshCw size={14} /> Refresh
              </button>
              <button
                onClick={exportData}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
              >
                <Download size={14} /> Export
              </button>
            </div>
          </div>
          
          {lastUpdated && (
            <div className="text-xs opacity-80">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-5 gap-2 mt-4">
            {[
              { value: pendingTasks.length, label: 'Tasks' },
              { value: activeContent.length, label: 'In Production' },
              { value: upcomingGrants.length, label: 'Grants' },
              { value: data.partners.length, label: 'Partners' },
              { value: data.donors.length, label: 'Donors' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/15 p-3 rounded-lg text-center">
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Alert Banner */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2.5">
            <AlertTriangle size={18} className="text-red-600" />
            <span className="text-sm text-red-800">
              {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''} need attention
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-genius-red text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {activeTab === 'overview' && (
            <>
              <SectionHeader
                icon={CheckCircle}
                title="Action Items"
                count={pendingTasks.length}
                onAdd={() => setShowAddTask(true)}
                collapsed={collapsed.tasks}
                onToggle={() => toggleCollapse('tasks')}
              />
              {!collapsed.tasks && (
                <div className="flex flex-col gap-2 mb-6">
                  {pendingTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onUpdate={(t) => updateItem('tasks', t)}
                      onDelete={deleteTask}
                    />
                  ))}
                  {pendingTasks.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No pending tasks</p>
                  )}
                </div>
              )}

              <SectionHeader
                icon={Video}
                title="Content In Production"
                count={activeContent.length}
                collapsed={collapsed.content}
                onToggle={() => toggleCollapse('content')}
              />
              {!collapsed.content && (
                <div className="mb-6">
                  {activeContent.map(c => <ContentItem key={c.id} content={c} onUpdate={(item) => updateItem('content_pipeline', item)} />)}
                  {activeContent.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No active productions</p>}
                </div>
              )}

              <SectionHeader
                icon={AlertTriangle}
                title="Policy Updates"
                count={data.policy.length}
                collapsed={collapsed.policy}
                onToggle={() => toggleCollapse('policy')}
              />
              {!collapsed.policy && (
                <div className="mb-6">
                  {data.policy.map(p => <PolicyItem key={p.id} policy={p} />)}
                </div>
              )}

              <SectionHeader
                icon={Clock}
                title="Upcoming Deadlines"
                count={upcomingGrants.length + upcomingEvents.length}
                collapsed={collapsed.deadlines}
                onToggle={() => toggleCollapse('deadlines')}
              />
              {!collapsed.deadlines && (
                <div className="flex flex-col gap-2">
                  {upcomingGrants.slice(0, 3).map(g => (
                    <GrantItem key={g.id} grant={g} onUpdate={(item) => updateItem('grants', item)} />
                  ))}
                  {upcomingEvents.slice(0, 2).map(e => (
                    <EventItem key={e.id} event={e} onUpdate={(item) => updateItem('events', item)} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'content' && (
            <>
              <SectionHeader icon={Video} title="Content Pipeline" count={data.content.length} collapsed={false} onToggle={() => {}} />
              <div>
                {data.content.map(c => <ContentItem key={c.id} content={c} onUpdate={(item) => updateItem('content_pipeline', item)} />)}
                {data.content.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No content in pipeline. Add items in Supabase Table Editor.</p>}
              </div>
            </>
          )}

          {activeTab === 'grants' && (
            <>
              <SectionHeader icon={DollarSign} title="Grant Pipeline" count={data.grants.length} collapsed={false} onToggle={() => {}} />
              <div>
                {data.grants.map(g => <GrantItem key={g.id} grant={g} onUpdate={(item) => updateItem('grants', item)} />)}
              </div>
            </>
          )}

          {activeTab === 'partners' && (
            <>
              <SectionHeader icon={Users} title="Partner Organizations" count={data.partners.length} collapsed={false} onToggle={() => {}} />
              <div>
                {data.partners.map(p => <PartnerItem key={p.id} partner={p} onUpdate={(item) => updateItem('partners', item)} />)}
              </div>
            </>
          )}

          {activeTab === 'donors' && (
            <>
              <SectionHeader icon={Heart} title="Donors & Funders" count={data.donors.length} collapsed={false} onToggle={() => {}} />
              <div>
                {data.donors.map(d => <DonorItem key={d.id} donor={d} onUpdate={(item) => updateItem('donors', item)} />)}
                {data.donors.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No donors yet. Add items in Supabase Table Editor.</p>}
              </div>
            </>
          )}

          {activeTab === 'media' && (
            <>
              <SectionHeader icon={Mic} title="Media Opportunities" count={data.media.length} collapsed={false} onToggle={() => {}} />
              <div>
                {data.media.map(m => <MediaItem key={m.id} media={m} onUpdate={(item) => updateItem('media', item)} />)}
              </div>
            </>
          )}

          {activeTab === 'press' && (
            <>
              <SectionHeader icon={Newspaper} title="Press & Coverage" count={data.press.length} collapsed={false} onToggle={() => {}} />
              <div>
                {data.press.map(p => <PressItem key={p.id} press={p} onUpdate={(item) => updateItem('press', item)} />)}
                {data.press.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No press items yet. Add items in Supabase Table Editor.</p>}
              </div>
            </>
          )}

          {activeTab === 'experts' && (
            <>
              <SectionHeader icon={UserCheck} title="Expert Network" count={data.experts.length} collapsed={false} onToggle={() => {}} />
              <div>
                {data.experts.map(e => <ExpertItem key={e.id} expert={e} onUpdate={(item) => updateItem('experts', item)} />)}
                {data.experts.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No experts yet. Add items in Supabase Table Editor.</p>}
              </div>
            </>
          )}

          {activeTab === 'events' && (
            <>
              <SectionHeader icon={Calendar} title="Events & Conferences" count={data.events.length} collapsed={false} onToggle={() => {}} />
              <div>
                {data.events.map(e => <EventItem key={e.id} event={e} onUpdate={(item) => updateItem('events', item)} />)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onAdd={addTask} />}
    </div>
  )
}
