import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    
    // Extract the values
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const aboutMe = formData.get('aboutMe') as string;
    const profileImage = formData.get('profileImage') as File | null;
    const userName = formData.get('userName') as string;

    // Validation
    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Handle profile image upload here if needed
    if (profileImage) {
      // Add your image upload logic here
      // imageUrl = await uploadImage(profileImage);
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        name: `${firstName} ${lastName}`,
        userName: userName,
        bio: aboutMe,
        // Add image field in schema if needed
        // image: imageUrl,
      }
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        userName: updatedUser.userName,
        bio: updatedUser.bio
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}