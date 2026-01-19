import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../../models/UserModel'; 

// Generate JWT Token
const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' } as jwt.SignOptions
  );
};

// Register User
// Register User
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    console.log('Registration attempt:', { name, email, role,password }); 

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email); 
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password,
      role: role || 'employee',
    });

    console.log('User created successfully:', user._id); 

    
    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};


// Login 
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and password is correct
    const user = await UserModel.findOne({ email }).select('+password');
    
    console.log('User found:', user); 
    console.log('Input password:', password); 
    console.log('Stored hash:', user?.password);

    if (!user || !(await user.comparePassword(password))) {
      console.log('Login failed: Invalid email or password'); 
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};
// Get Current User
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById((req as any).user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Login user data',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message,
    });
  }
};