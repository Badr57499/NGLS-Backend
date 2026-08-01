const express = require('express')
const Ancs = require('../Models/ancs')

// Create announcement
const addAncs = async (req, res) => {
    try {
        const { title, body } = req.body
        const image = req.file?.path || null

        if (!title || !body) {
            return res.status(400).json({ message: 'title and body are required' })
        }

        const newAncs = new Ancs({
            title,
            body,
            createdat: new Date(),
            image,
        })

        const saved = await newAncs.save()
        return res.status(201).json(saved)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Failed to create announcement', error: err.message })
    }
}

// Get all announcements
const getAncs = async (req, res) => {
    try {
        const items = await Ancs.find().sort({ createdAt: -1 })
        return res.status(200).json(items)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Failed to fetch announcements', error: err.message })
    }
}

// Get one announcement by id
const getAncsById = async (req, res) => {
    try {
        const { id } = req.params
        const item = await Ancs.findById(id)
        if (!item) return res.status(404).json({ message: 'Announcement not found' })
        return res.status(200).json(item)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Failed to fetch announcement', error: err.message })
    }
}

// Update announcement
const updateAncs = async (req, res) => {
    try {
        const { id } = req.params
        const { title, body } = req.body
        const image = req.file?.path

        const update = {}
        if (title) update.title = title
        if (body) update.body = body
        if (image) update.image = image

        const updated = await Ancs.findByIdAndUpdate(id, update, { new: true })
        if (!updated) return res.status(404).json({ message: 'Announcement not found' })
        return res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Failed to update announcement', error: err.message })
    }
}

// Delete announcement
const deleteAncs = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Ancs.findByIdAndDelete(id)
        if (!deleted) return res.status(404).json({ message: 'Announcement not found' })
        return res.status(200).json({ message: 'Announcement deleted' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Failed to delete announcement', error: err.message })
    }
}

module.exports = { addAncs, getAncs, getAncsById, updateAncs, deleteAncs }