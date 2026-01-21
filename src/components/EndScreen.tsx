import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate, staticFile } from 'remotion';
import { THEME } from '../styles/theme';
import { TEMPLATES } from '../data/templates';
import config from '../data/config.json';
import { Heart, ThumbsUp, BellRing } from 'lucide-react';

export const EndScreen: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const selectedTemplate = (TEMPLATES as any)[config.templateId] || TEMPLATES.modern_dark;
    const colors = selectedTemplate.colors;

    const message = config.endScreenMessage || "Comment your score below!";

    const springConfig = {
        damping: 12,
        stiffness: 100,
    };

    const scale = spring({
        frame,
        fps,
        config: springConfig,
        delay: 10,
    });

    const opacity = interpolate(frame, [0, 15], [0, 1]);

    return (
        <AbsoluteFill
            style={{
                background: config.bgImage ? `url(${staticFile(config.bgImage)}) center/cover no-repeat` : colors.background,
                display: 'flex',

                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                fontFamily: THEME.fontFamily,
                color: '#fff',
            }}
        >
            <div style={{
                opacity,
                transform: `scale(${scale})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '40px',
                textAlign: 'center',
                width: '100%',
            }}>
                {/* Icons Row */}
                <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ backgroundColor: colors.primary, padding: '20px', borderRadius: '50%', boxShadow: `0 0 30px ${colors.primary}66` }}>
                        <ThumbsUp size={60} color="#fff" strokeWidth={3} />
                    </div>
                    <div style={{ backgroundColor: colors.accent, padding: '20px', borderRadius: '50%', boxShadow: `0 0 30px ${colors.accent}66` }}>
                        <Heart size={60} color="#fff" fill="#fff" />
                    </div>
                    <div style={{ backgroundColor: colors.primary, padding: '20px', borderRadius: '50%', boxShadow: `0 0 30px ${colors.primary}66` }}>
                        <BellRing size={60} color="#fff" strokeWidth={3} />
                    </div>
                </div>

                {/* Message Text */}
                <h1 style={{
                    fontSize: '80px',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                    textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    padding: '0 20px',
                    background: `linear-gradient(to bottom, #ffffff, ${colors.primary}aa)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {message}
                </h1>

                {/* Call to Action Subtext */}
                <div style={{
                    fontSize: '40px',
                    fontWeight: 700,
                    opacity: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    LIKE • SHARE • SUBSCRIBE
                </div>
            </div>

            {/* Decorative background elements if no custom image */}
            {!config.bgImage && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '-10%',
                        right: '-10%',
                        width: '800px',
                        height: '800px',
                        background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-10%',
                        left: '-10%',
                        width: '800px',
                        height: '800px',
                        background: `radial-gradient(circle, ${colors.accent}10 0%, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                    }} />
                </>
            )}
        </AbsoluteFill>
    );
};
