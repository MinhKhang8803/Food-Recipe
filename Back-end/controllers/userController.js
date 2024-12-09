const User = require('../models/User');  
const BanUser = require('../models/Ban');
const Report = require('../models/Report');

exports.updateAvatar = async (req, res) => {
    const { avatarUrl } = req.body;

    try {
        const user = await User.findById(req.user.userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.avatarUrl = avatarUrl;  
        await user.save(); 

        return res.status(200).json({ message: 'Avatar updated successfully', avatarUrl: user.avatarUrl });
    } catch (error) {
        console.error('Error updating avatar:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        console.log('Fetching user with ID:', req.user.id);

        const user = await User.findById(req.user.id).select('fullName email avatarUrl');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.searchUsers = async (req, res) => {
    const { keyword } = req.query; 

    try {
        const users = await User.find({
            fullName: { $regex: keyword, $options: 'i' }, 
        }).select('fullName avatarUrl');

        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.banUser = async (req, res) => {
    const { email, reason, banDuration } = req.body;

    if (!email || !reason || !banDuration) {
        return res.status(400).json({ message: 'Email, reason, and ban duration are required' });
    }

    try {
        console.log('Fetching user with email:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Checking if user is already banned:', email);
        const existingBan = await BanUser.findOne({ email });
        if (existingBan) {
            console.error('User already banned:', email);
            return res.status(400).json({ message: 'User is already banned' });
        }

        console.log('Creating new ban record for user:', email);
        const newBan = new BanUser({ email, reason, banDuration });
        await newBan.save();

        console.log('User banned successfully:', newBan);
        return res.status(200).json({
            message: `User ${email} has been banned for ${banDuration}`,
            banDetails: newBan,
        });
    } catch (error) {
        console.error('Error in banUser:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getBannedUsers = async (req, res) => {
    try {
        const bannedUsers = await BanUser.find().sort({ bannedAt: -1 }); 
        res.status(200).json(bannedUsers);
    } catch (error) {
        console.error('Error fetching banned users:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.reportPost = async (req, res) => {
    const { postId, reason } = req.body; 

    if (!postId || !reason) {
        return res.status(400).json({ message: 'Post ID and reason are required' });
    }

    try {
        const existingReport = await Report.findOne({ postId, reportedBy: req.user.userId });
        if (existingReport) {
            return res.status(400).json({ message: 'You have already reported this post.' });
        }

        const newReport = new Report({
            postId,
            reportedBy: req.user.userId,
            reason,
        });

        await newReport.save(); 

        return res.status(200).json({ message: 'Report submitted successfully.', report: newReport });
    } catch (error) {
        console.error('Error reporting post:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reportedBy', 'fullName') 
            .populate('postId', 'content image'); 

        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deletePostAndReport = async (req, res) => {
    const { postId, reportId } = req.params;

    try {
        await Post.findByIdAndDelete(postId); 
        await Report.findByIdAndDelete(reportId); 

        res.status(200).json({ message: 'Post and report deleted successfully.' });
    } catch (error) {
        console.error('Error deleting post and report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.dismissReport = async (req, res) => {
    const { reportId } = req.params;

    try {
        await Report.findByIdAndDelete(reportId); 

        res.status(200).json({ message: 'Report dismissed successfully.' });
    } catch (error) {
        console.error('Error dismissing report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};