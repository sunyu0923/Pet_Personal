"""v2 quiz schema - new question format, cat personality types, rename mbti_code

Revision ID: a1b2c3d4e5f6
Revises: 6370679c8050
Create Date: 2026-04-15 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '6370679c8050'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- questions table ---
    op.drop_constraint('uq_question', 'questions', type_='unique')
    op.drop_column('questions', 'dimension')
    op.drop_column('questions', 'option_a')
    op.drop_column('questions', 'option_b')
    op.add_column('questions', sa.Column('options', sa.JSON(), nullable=False, server_default='[]'))
    op.alter_column('questions', 'options', server_default=None)
    op.create_unique_constraint('uq_question_v2', 'questions', ['pet_type', 'order_num'])

    # --- personality_types table ---
    op.drop_constraint('uq_personality_type', 'personality_types', type_='unique')
    op.alter_column('personality_types', 'mbti_code', new_column_name='type_code',
                     type_=sa.String(length=10), existing_type=sa.String(length=4))
    op.add_column('personality_types', sa.Column('english_name', sa.String(length=100), nullable=True))
    op.add_column('personality_types', sa.Column('common_breed', sa.String(length=100), nullable=True))
    op.add_column('personality_types', sa.Column('life_tips', sa.Text(), nullable=True))
    op.add_column('personality_types', sa.Column('training_tips', sa.Text(), nullable=True))
    op.alter_column('personality_types', 'description', existing_type=sa.Text(), nullable=True)
    op.alter_column('personality_types', 'strengths', existing_type=sa.ARRAY(sa.Text()), nullable=True)
    op.alter_column('personality_types', 'weaknesses', existing_type=sa.ARRAY(sa.Text()), nullable=True)
    op.create_unique_constraint('uq_personality_type_v2', 'personality_types', ['pet_type', 'type_code'])

    # --- test_results table ---
    op.alter_column('test_results', 'mbti_code', new_column_name='type_code',
                     type_=sa.String(length=10), existing_type=sa.String(length=4))
    op.alter_column('test_results', 'score_ei', existing_type=sa.Integer(), nullable=True)
    op.alter_column('test_results', 'score_sn', existing_type=sa.Integer(), nullable=True)
    op.alter_column('test_results', 'score_tf', existing_type=sa.Integer(), nullable=True)
    op.alter_column('test_results', 'score_jp', existing_type=sa.Integer(), nullable=True)
    op.alter_column('test_results', 'pct_ei', existing_type=sa.Integer(), nullable=True)
    op.alter_column('test_results', 'pct_sn', existing_type=sa.Integer(), nullable=True)
    op.alter_column('test_results', 'pct_tf', existing_type=sa.Integer(), nullable=True)
    op.alter_column('test_results', 'pct_jp', existing_type=sa.Integer(), nullable=True)
    op.add_column('test_results', sa.Column('type_scores', sa.JSON(), nullable=True))


def downgrade() -> None:
    # --- test_results table ---
    op.drop_column('test_results', 'type_scores')
    op.alter_column('test_results', 'pct_jp', existing_type=sa.Integer(), nullable=False)
    op.alter_column('test_results', 'pct_tf', existing_type=sa.Integer(), nullable=False)
    op.alter_column('test_results', 'pct_sn', existing_type=sa.Integer(), nullable=False)
    op.alter_column('test_results', 'pct_ei', existing_type=sa.Integer(), nullable=False)
    op.alter_column('test_results', 'score_jp', existing_type=sa.Integer(), nullable=False)
    op.alter_column('test_results', 'score_tf', existing_type=sa.Integer(), nullable=False)
    op.alter_column('test_results', 'score_sn', existing_type=sa.Integer(), nullable=False)
    op.alter_column('test_results', 'score_ei', existing_type=sa.Integer(), nullable=False)
    op.alter_column('test_results', 'type_code', new_column_name='mbti_code',
                     type_=sa.String(length=4), existing_type=sa.String(length=10))

    # --- personality_types table ---
    op.drop_constraint('uq_personality_type_v2', 'personality_types', type_='unique')
    op.drop_column('personality_types', 'training_tips')
    op.drop_column('personality_types', 'life_tips')
    op.drop_column('personality_types', 'common_breed')
    op.drop_column('personality_types', 'english_name')
    op.alter_column('personality_types', 'weaknesses', existing_type=sa.ARRAY(sa.Text()), nullable=False)
    op.alter_column('personality_types', 'strengths', existing_type=sa.ARRAY(sa.Text()), nullable=False)
    op.alter_column('personality_types', 'description', existing_type=sa.Text(), nullable=False)
    op.alter_column('personality_types', 'type_code', new_column_name='mbti_code',
                     type_=sa.String(length=4), existing_type=sa.String(length=10))
    op.create_unique_constraint('uq_personality_type', 'personality_types', ['pet_type', 'mbti_code'])

    # --- questions table ---
    op.drop_constraint('uq_question_v2', 'questions', type_='unique')
    op.drop_column('questions', 'options')
    op.add_column('questions', sa.Column('dimension', sa.String(length=3), nullable=False, server_default='E/I'))
    op.alter_column('questions', 'dimension', server_default=None)
    op.add_column('questions', sa.Column('option_a', sa.Text(), nullable=False, server_default=''))
    op.alter_column('questions', 'option_a', server_default=None)
    op.add_column('questions', sa.Column('option_b', sa.Text(), nullable=False, server_default=''))
    op.alter_column('questions', 'option_b', server_default=None)
    op.create_unique_constraint('uq_question', 'questions', ['pet_type', 'dimension', 'order_num'])
